import { NoteWithHand, noteNameToSemitone } from "./notes";
import { noteToMidi } from "./notes"

export type TrainingProgram = {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Custom';
  notes: NoteWithHand[];
  notesToStartWith: NoteWithHand[];
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'program1',
    name: 'Basic Octaves',
    description: 'Learn the same note in different octaves and its solfège.',
    difficulty: 'Beginner',
    notes: [{ note: 'C4' }, { note: 'C5' }, { note: 'D4' }, { note: 'D5' }, { note: 'E4' }, { note: 'E5' }, { note: 'F4' }, { note: 'F5' }],
    notesToStartWith: [{ note: 'C4' }, { note: 'D4' }, { note: 'E4' }]
  },
  {
    id: 'program2',
    name: 'Basic Major Scale',
    description: 'Learn the notes of a major scale from C to C.',
    difficulty: 'Beginner',
    notes: [{ note: 'C4' }, { note: 'D4' }, { note: 'E4' }, { note: 'F4' }, { note: 'G4' }, { note: 'A4' }, { note: 'B4' }, { note: 'C5' }],
    notesToStartWith: [{ note: 'C4' }, { note: 'D4' }, { note: 'E4' }]
  },
  {
    id: 'program3',
    name: 'C Natural Minor Scale',
    description: 'Learn the notes of the C natural minor scale, starting from C.',
    difficulty: 'Intermediate',
    notes: [{ note: 'C4' }, { note: 'D4' }, { note: 'Eb4' }, { note: 'F4' }, { note: 'G4' }, { note: 'Ab4' }, { note: 'Bb4' }, { note: 'C5' }],
    notesToStartWith: [{ note: 'C4' }, { note: 'Eb4' }, { note: 'G4' }]
  },
  {
    id: 'program4',
    name: 'C Harmonic Minor Scale',
    description: 'Learn the notes of the C harmonic{note:  minor scale}, starting from C.',
    difficulty: 'Intermediate',
    notes: [{ note: 'C4' }, { note: 'D4' }, { note: 'Eb4' }, { note: 'F4' }, { note: 'G4' }, { note: 'Ab4' }, { note: 'B4' }, { note: 'C5' }],
    notesToStartWith: [{ note: 'C4' }, { note: 'Eb4' }, { note: 'G4' }]
  }  
] as const;


export function createRelativeSequence(
  rootNote: string,
  programNotes: string[]
): number[] {
  const rootSemitone = noteNameToSemitone(rootNote);

  return programNotes.map((note) => {
    const semitone = noteNameToSemitone(note);
    let interval = semitone - rootSemitone;

    // Keep in range of 0 to 11, adjust for negative values
    if (interval < 0) interval += 12;

    return interval;
  });
}


interface NoteWithAccidental {
  midi: number;
  accidental: string; // "sharp", "flat", or "natural"
}

export function buildExpectedMidiSequence(
  program: TrainingProgram,
  count: number
): NoteWithAccidental[] {
  const sourceNotes = [...program.notesToStartWith, ...program.notes]
  const sequence: NoteWithAccidental[] = []
  console.log("sourceNotes", sourceNotes)
  let index = 0
  while (sequence.length < count) {
    const note = sourceNotes[index % sourceNotes.length]
    const midi = noteToMidi(note)

    // Determine if the note is sharp, flat, or natural
    const accidental = getAccidentalForNote(note)

    sequence.push({ midi, accidental })
    index++
  }

  return sequence
}

// Helper function to determine the accidental
const getAccidentalForNote = (noteName: string): string => {
  if (noteName.includes("#")) {
    return "sharp";
  } else if (noteName.includes("b")) {
    return "flat";
  }
  
  return "natural";
};
