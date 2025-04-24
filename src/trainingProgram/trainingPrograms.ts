import { Note, noteNameToSemitone } from "./notes";
import { noteToMidi } from "./notes"

export type TrainingProgram = {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  notes: Note[];
  notesToStartWith: Note[];
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'program1',
    name: 'Basic Octaves',
    description: 'Learn the same note in different octaves and its solfège.',
    difficulty: 'Beginner',
    notes: ['C4', 'C5', 'D4', 'D5', 'E4', 'E5', 'F4', 'F5'],
    notesToStartWith: ['C4', 'D4', 'E4']
  },
  {
    id: 'program2',
    name: 'Basic Major Scale',
    description: 'Learn the notes of a major scale from C to C.',
    difficulty: 'Beginner',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    notesToStartWith: ['C4', 'D4', 'E4']
  },
  {
    id: 'program3',
    name: 'C Natural Minor Scale',
    description: 'Learn the notes of the C natural minor scale, starting from C.',
    difficulty: 'Intermediate',
    notes: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'],
    notesToStartWith: ['C4', 'Eb4', 'G4']
  },
  {
    id: 'program4',
    name: 'C Harmonic Minor Scale',
    description: 'Learn the notes of the C harmonic minor scale, starting from C.',
    difficulty: 'Intermediate',
    notes: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'B4', 'C5'],
    notesToStartWith: ['C4', 'Eb4', 'G4']
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
