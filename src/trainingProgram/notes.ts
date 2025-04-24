export type Note = string; // e.g. "C4", "D#4"

export type NoteWithHand = {
  note: Note
  hand?: 'left' | 'right'
}

const solfegeMap: Record<string, string> = {
  'C': 'do', 'C#': 'di', 'D': 're', 'D#': 'ri', 'E': 'mi',
  'F': 'fa', 'F#': 'fi', 'G': 'sol', 'G#': 'si',
  'A': 'la', 'A#': 'li', 'B': 'ti'
};

export function getSolfege(note: string): string {
  const noteName = note.replace(/\d+/, '');
  return solfegeMap[noteName] || noteName;
}

export function getNoteDisplay(note: string): string {
  return `${getSolfege(note)} - ${note}`;
}

// Solfège mapping
const solfègeMapping: Record<string, string> = {
  'C': 'do',
  'C#': 'do#',
  'D': 're',
  'D#': 're#',
  'E': 'mi',
  'F': 'fa',
  'F#': 'fa#',
  'G': 'sol',
  'G#': 'sol#',
  'A': 'la',
  'A#': 'la#',
  'B': 'ti'
};

const SEMITONES: Record<string, number> = {
  C: 0,
  'C#': 1,
  'Db': 1,
  D: 2,
  'D#': 3,
  'Eb': 3,
  E: 4,
  F: 5,
  'F#': 6,
  'Gb': 6,
  G: 7,
  'G#': 8,
  'Ab': 8,
  A: 9,
  'A#': 10,
  'Bb': 10,
  B: 11,
};
// Convert note to solfège (e.g., C4 -> do)
export const convertToSolfège = (note: string): string => {
  const noteName = note.replace(/[0-9]/g, ''); // Remove octave number
  return solfègeMapping[noteName] || noteName; // Return solfège or default to the note itself if not found
};

export function noteNameToSemitone(noteName: string): number {
  const cleaned = noteName.trim().toUpperCase();
  if (!(cleaned in SEMITONES)) {
    throw new Error(`Unknown note: ${noteName}`);
  }
  return SEMITONES[cleaned];
}

export function midiToNoteNameWithOctave(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const name = notes[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}/${octave}`;
}

const NOTE_OFFSETS = {
  'C': 0,
  'C#': 1,
  'DB': 1,  // Enharmonic equivalence for C#
  'D': 2,
  'D#': 3,
  'EB': 3,  // Enharmonic equivalence for D#
  'E': 4,
  'FB': 4,  // Enharmonic equivalence for E
  'F': 5,
  'F#': 6,
  'GB': 6,  // Enharmonic equivalence for F#
  'G': 7,
  'G#': 8,
  'AB': 8,  // Enharmonic equivalence for G#
  'A': 9,
  'A#': 10,
  'BB': 10, // Enharmonic equivalence for A#
  'B': 11,
  'CB': 11  // Enharmonic equivalence for B
};


/**
 * Converts a note name (e.g. "C4", "A#3", "Bb5") to MIDI note number.
 */
export function noteToMidi(note: string): number {
  const match = note.match(/^([A-Ga-g]{1}(?:#|b)?)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid note format: ${note}`);
  }

  const [, pitchClass, octaveStr] = match;
  const normalizedPitch = pitchClass.toUpperCase();
  const semitone = NOTE_OFFSETS[normalizedPitch];
  const octave = parseInt(octaveStr, 10);

  if (semitone === undefined || isNaN(octave)) {
    throw new Error(`Unknown pitch or octave: ${note}`);
  }

  return 12 * (octave + 1) + semitone;
}
