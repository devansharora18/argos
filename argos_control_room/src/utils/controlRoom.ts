import type { PersonnelTone } from '../types/controlRoom';

export const formatClock = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const mutateValue = (
  value: number,
  range: number,
  minimum: number,
): number => {
  const delta = Math.floor(Math.random() * ((range * 2) + 1)) - range;
  return Math.max(minimum, value + delta);
};

export const tagToneClass = (tone: PersonnelTone): string => {
  if (tone === 'danger') {
    return 'border-[#6e2e37] text-[#ff9ca8]';
  }
  if (tone === 'ok') {
    return 'border-[#2a6242] text-[#77eda6]';
  }
  if (tone === 'route') {
    return 'border-[#35507a] text-[#93c3ff]';
  }
  return 'border-[#3a3f4f] text-[#a3a8b5]';
};
