import { SpeechClient } from '@google-cloud/speech';
import { logger } from '../../bootstrap/logger';

// ---------------------------------------------------------------------------
// Google Speech-to-Text client
// Accepts base64-encoded audio from the Flutter app and returns a transcript.
// Supports WEBM_OPUS (Flutter/browser default) and LINEAR16 (raw PCM).
// ---------------------------------------------------------------------------

let _speechClient: SpeechClient | null = null;

function getSpeechClient(): SpeechClient {
  if (!_speechClient) {
    _speechClient = new SpeechClient();
  }
  return _speechClient;
}

export type AudioEncoding = 'WEBM_OPUS' | 'LINEAR16' | 'MP3' | 'FLAC' | 'OGG_OPUS';

export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  languageCode: string;
}

/**
 * Transcribes a base64-encoded audio clip using Google Speech-to-Text.
 *
 * @param audioBase64  Base64-encoded audio bytes (no data URI prefix)
 * @param encoding     Audio encoding format — defaults to WEBM_OPUS
 * @param sampleRate   Sample rate in Hz — defaults to 48000 (Flutter default)
 * @returns            Transcription result or null if transcription failed
 */
export async function transcribeAudio(
  audioBase64: string,
  encoding: AudioEncoding = 'WEBM_OPUS',
  sampleRate = 48000
): Promise<TranscriptionResult | null> {
  const client = getSpeechClient();

  // Strip data URI prefix if present (e.g. "data:audio/webm;base64,")
  const cleanBase64 = audioBase64.includes(',')
    ? audioBase64.split(',')[1] ?? audioBase64
    : audioBase64;

  const request = {
    audio: {
      content: cleanBase64,
    },
    config: {
      encoding: encoding as never,
      sampleRateHertz: sampleRate,
      languageCode: 'en-IN',       // Primary: Indian English
      alternativeLanguageCodes: [
        'hi-IN',                   // Hindi fallback
        'en-US',                   // US English fallback
      ],
      enableAutomaticPunctuation: true,
      model: 'latest_long',        // Best accuracy for crisis reports
      useEnhanced: true,
    },
  };

  try {
    const [response] = await client.recognize(request);
    const results = response.results ?? [];

    if (results.length === 0) {
      logger.warn('speechToText: no transcription results returned');
      return null;
    }

    // Concatenate all result alternatives into one transcript
    const fullTranscript = results
      .map(r => r.alternatives?.[0]?.transcript ?? '')
      .join(' ')
      .trim();

    if (!fullTranscript) {
      logger.warn('speechToText: empty transcript returned');
      return null;
    }

    // Average confidence across all segments
    const totalConfidence = results.reduce(
      (sum, r) => sum + (r.alternatives?.[0]?.confidence ?? 0),
      0
    );
    const avgConfidence = results.length > 0 ? totalConfidence / results.length : 0;

    logger.info('speechToText: transcription complete', {
      transcript_length: fullTranscript.length,
      confidence: avgConfidence,
      segments: results.length,
    });

    return {
      transcript: fullTranscript,
      confidence: avgConfidence,
      languageCode: 'en-IN',
    };
  } catch (err) {
    logger.error('speechToText: transcription failed', {
      error: err instanceof Error ? err.message : String(err),
      encoding,
    });
    return null;
  }
}
