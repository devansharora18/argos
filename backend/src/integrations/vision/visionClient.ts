import { ImageAnnotatorClient } from '@google-cloud/vision';
import { logger } from '../../bootstrap/logger';

// ---------------------------------------------------------------------------
// Google Cloud Vision API client
// Analyses a camera frame and extracts crisis-relevant visual signals.
// Used to augment Gemini's classification prompt with visual context.
// ---------------------------------------------------------------------------

let _visionClient: ImageAnnotatorClient | null = null;

function getVisionClient(): ImageAnnotatorClient {
  if (!_visionClient) {
    _visionClient = new ImageAnnotatorClient();
  }
  return _visionClient;
}

// Labels that indicate fire or smoke when detected with high confidence
const FIRE_SMOKE_LABELS = new Set([
  'fire', 'smoke', 'flame', 'burning', 'wildfire',
  'conflagration', 'blaze', 'combustion', 'ember',
]);

// Labels that indicate a security threat
const SECURITY_LABELS = new Set([
  'gun', 'firearm', 'weapon', 'knife', 'riot',
  'fighting', 'violence', 'altercation',
]);

export type CrowdDensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VisualFeatures {
  person_count: number;
  crowd_density: CrowdDensity;
  fire_smoke_signal: boolean;
  fire_smoke_confidence: number;
  security_signal: boolean;
  objects_detected: string[];
  raw_labels: string[];
}

/**
 * Analyses a base64-encoded JPEG/PNG camera frame using Cloud Vision API.
 * Returns structured visual features for injection into the Gemini prompt.
 *
 * @param frameBase64  Base64-encoded image (no data URI prefix needed)
 * @returns            VisualFeatures or null if analysis failed
 */
export async function analyseFrame(frameBase64: string): Promise<VisualFeatures | null> {
  const client = getVisionClient();

  // Strip data URI prefix if present
  const cleanBase64 = frameBase64.includes(',')
    ? frameBase64.split(',')[1] ?? frameBase64
    : frameBase64;

  const imageSource = { content: cleanBase64 };

  try {
    // Run all three detections in a single batched API call
    const [result] = await client.annotateImage({
      image: imageSource,
      features: [
        { type: 'OBJECT_LOCALIZATION', maxResults: 50 },
        { type: 'LABEL_DETECTION', maxResults: 20 },
        { type: 'SAFE_SEARCH_DETECTION' },
      ],
    });

    // --- Person count from object localisation ---
    type ObjAnnotation  = { name?: string | null; score?: number | null };
    type LabelAnnotation = { description?: string | null; score?: number | null };

    const objects = (result.localizedObjectAnnotations ?? []) as ObjAnnotation[];
    const personCount = objects.filter(
      (obj: ObjAnnotation) => obj.name?.toLowerCase() === 'person' && (obj.score ?? 0) >= 0.65
    ).length;

    const objectNames = objects
      .filter((obj: ObjAnnotation) => (obj.score ?? 0) >= 0.6)
      .map((obj: ObjAnnotation) => obj.name ?? '')
      .filter(Boolean);

    // --- Fire / smoke from label detection ---
    const labels = (result.labelAnnotations ?? []) as LabelAnnotation[];
    const rawLabels = labels
      .filter((l: LabelAnnotation) => (l.score ?? 0) >= 0.6)
      .map((l: LabelAnnotation) => l.description?.toLowerCase() ?? '')
      .filter(Boolean);

    let fireSmokeConfidence = 0;
    for (const label of labels) {
      const name = label.description?.toLowerCase() ?? '';
      if (FIRE_SMOKE_LABELS.has(name)) {
        fireSmokeConfidence = Math.max(fireSmokeConfidence, label.score ?? 0);
      }
    }

    const fireSmokeSignal = fireSmokeConfidence >= 0.70;

    // --- Security signal from labels + safe search ---
    const securityFromLabels = rawLabels.some((l: string) => SECURITY_LABELS.has(l));
    const safeSearch = result.safeSearchAnnotation;
    const violenceLevel = String(safeSearch?.violence ?? 'UNKNOWN');
    const securityFromSafeSearch = ['LIKELY', 'VERY_LIKELY'].includes(violenceLevel);
    const securitySignal = securityFromLabels || securityFromSafeSearch;

    // --- Crowd density ---
    const crowdDensity = scoreCrowdDensity(personCount);

    const features: VisualFeatures = {
      person_count: personCount,
      crowd_density: crowdDensity,
      fire_smoke_signal: fireSmokeSignal,
      fire_smoke_confidence: Math.round(fireSmokeConfidence * 100) / 100,
      security_signal: securitySignal,
      objects_detected: objectNames,
      raw_labels: rawLabels.slice(0, 10),
    };

    logger.info('visionClient: frame analysis complete', {
      person_count: personCount,
      crowd_density: crowdDensity,
      fire_smoke_signal: fireSmokeSignal,
      security_signal: securitySignal,
    });

    return features;
  } catch (err) {
    logger.error('visionClient: frame analysis failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

function scoreCrowdDensity(personCount: number): CrowdDensity {
  if (personCount >= 30) return 'CRITICAL';
  if (personCount >= 15) return 'HIGH';
  if (personCount >= 5)  return 'MEDIUM';
  return 'LOW';
}
