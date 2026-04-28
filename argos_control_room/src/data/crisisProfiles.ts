export type CrisisProfile = {
  displayName: string;
  glyph: string;
  bannerColor: string;
  glowColor: string;
  textAccent: string;
};

const fallback: CrisisProfile = {
  displayName: 'Incident',
  glyph: '!',
  bannerColor: '#a1161a',
  glowColor: 'rgba(255, 40, 40, 0.35)',
  textAccent: '#ff8a8a',
};

const byType: Record<string, CrisisProfile> = {
  fire: {
    displayName: 'Fire',
    glyph: '🜂',
    bannerColor: '#a1161a',
    glowColor: 'rgba(255, 60, 40, 0.4)',
    textAccent: '#ff8a8a',
  },
  smoke: {
    displayName: 'Smoke',
    glyph: '◌',
    bannerColor: '#7a4128',
    glowColor: 'rgba(255, 130, 60, 0.3)',
    textAccent: '#ffae7a',
  },
  medical: {
    displayName: 'Medical',
    glyph: '✚',
    bannerColor: '#8a2030',
    glowColor: 'rgba(255, 80, 110, 0.35)',
    textAccent: '#ff96a6',
  },
  security: {
    displayName: 'Security',
    glyph: '◆',
    bannerColor: '#6a1f1f',
    glowColor: 'rgba(180, 40, 40, 0.4)',
    textAccent: '#ff9d8a',
  },
  stampede: {
    displayName: 'Crowd Surge',
    glyph: '⚏',
    bannerColor: '#7a4416',
    glowColor: 'rgba(255, 140, 40, 0.35)',
    textAccent: '#ffba6a',
  },
  structural: {
    displayName: 'Structural',
    glyph: '◫',
    bannerColor: '#3f4252',
    glowColor: 'rgba(150, 160, 180, 0.3)',
    textAccent: '#cdd1de',
  },
  flood: {
    displayName: 'Flood',
    glyph: '≋',
    bannerColor: '#26527a',
    glowColor: 'rgba(60, 140, 200, 0.35)',
    textAccent: '#8fcdff',
  },
};

export function profileForCrisisType(crisisType: string): CrisisProfile {
  return byType[crisisType.toLowerCase()] ?? fallback;
}

export function severityLabel(severity: number): string {
  if (severity >= 5) return 'CRITICAL';
  if (severity >= 4) return 'SEVERE';
  if (severity >= 3) return 'HIGH';
  if (severity >= 2) return 'MODERATE';
  return 'LOW';
}
