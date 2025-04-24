export type Note = {
  name: string; // e.g., "C", "D#", "F"
  octave?: number; // e.g., 4
  midi?: number; // e.g., 60
};

export type NoteGroup = Note[]; // can be one note or a chord, to play at the same time

export type TRAINING_PROGRAM = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  notes: NoteGroup[];
  startsWith?: NoteGroup[];
};

export const TRAINING_PROGRAMS: TRAINING_PROGRAM[] = [
  {
    id: "1",
    title: 'C Major - Intro (3 Notes)',
    description: 'Practice reading and playing the first three notes of the C major scale, and a simple C major chord.',
    difficulty: 'Beginner',
    duration: '2–3 min',
    notes: [
      [{ name: 'C', octave: 4, midi: 60 }],
      [{ name: 'D', octave: 4, midi: 62 }],
      [{ name: 'E', octave: 4, midi: 64 }],
    ],
    startsWith: [[{ name: 'C', octave: 4, midi: 60 }]],
  },
  {
    id: "2",
    title: 'C Major - Full Scale',
    description: 'Train on the full C major scale and basic triads.',
    difficulty: 'Beginner',
    duration: '5–7 min',
    notes: [
      [{ name: 'C', octave: 4, midi: 60 }],
      [{ name: 'D', octave: 4, midi: 62 }],
      [{ name: 'E', octave: 4, midi: 64 }],
      [{ name: 'F', octave: 4, midi: 65 }],
      [{ name: 'G', octave: 4, midi: 67 }],
      [{ name: 'A', octave: 4, midi: 69 }],
      [{ name: 'B', octave: 4, midi: 71 }],
      [{ name: 'C', octave: 5, midi: 72 }],
    ],
    startsWith: [[{ name: 'C', octave: 4, midi: 60 }]],
  },
  {
    id: "3",
    title: 'G Major - Easy Notes',
    description: 'Learn to recognize the notes and simple chords of G major.',
    difficulty: 'Beginner',
    duration: '3–5 min',
    notes: [
      [{ name: 'G', octave: 4, midi: 67 }],
      [{ name: 'A', octave: 4, midi: 69 }],
      [{ name: 'B', octave: 4, midi: 71 }],
      [{ name: 'C', octave: 5, midi: 72 }],
      [{ name: 'D', octave: 5, midi: 74 }],
      [{ name: 'E', octave: 5, midi: 76 }],
      [{ name: 'F#', octave: 5, midi: 78 }],
    ],
    startsWith: [[{ name: 'G', octave: 4, midi: 67 }]],
  },
];