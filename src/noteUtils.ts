const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SOLFEGE = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

export function frequencyToNoteName(freq: number): { note: string; solfege: string } {
  const A4 = 440;
  const semitonesFromA4 = Math.round(12 * Math.log2(freq / A4));
  const noteIndex = (semitonesFromA4 + 9 + 12 * 10) % 12; // offset A to C, wrap around
  return {
    note: NOTES[noteIndex],
    solfege: SOLFEGE[noteIndex],
  };
}
