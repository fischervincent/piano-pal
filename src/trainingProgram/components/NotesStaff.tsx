import { useEffect, useRef } from "react";
import { Accidental, Formatter, Renderer, Stave, StaveNote, Voice } from "vexflow";

interface NotesStaffProps {
  sequence: { midi: number; accidental: string }[];
  currentIndex: number;
  validatedIndexes: boolean[];
  wrongNote?: number | null;
}

const midiToNoteNameAndOctave = (midi: number, accidental: string) => {
  const noteNamesNaturalOrSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteNamesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const note = accidental == "flat" ? noteNamesFlat[noteIndex] : noteNamesNaturalOrSharp[noteIndex];
  return {note, octave};
}

const midiToVexflowNote = (midi: number, accidental: string): string => {
  // Handle accidentals based on the `accidental` property
  const { note, octave } = midiToNoteNameAndOctave(midi, accidental);
  const vexflowNote = `${note}/${octave}`;
  return vexflowNote;
};

const SolfegeByNote = {
  "C": "do",
  "C#": "do#",
  "Db": "doB",
  "D": "ré",
  "D#": "ré#",
  "E": "mi",
  "Eb": "miB",
  "F": "fa",
  "F#": "fa#",
  "G": "sol",
  "Gb": "solB",
  "G#": "sol#",
  "A": "la",
  "A#": "la#",
  "Ab": "laB",
  "B": "si",
  "Bb": "siB",
};


const NotesStaff = ({ sequence, currentIndex, validatedIndexes, wrongNote }: NotesStaffProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(500, 150);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    const stave = new Stave(10, 40, 480);
    stave.addClef("treble").setContext(context).draw();

    const notes = sequence.map((noteData, index) => {
      const { midi, accidental } = noteData;
      const key = midiToVexflowNote(midi, accidental); // Use MIDI value and accidental
      const note = new StaveNote({ keys: [key], duration: "q" });

      if (key.includes("#")) {
        note.addModifier(new Accidental("#"), 0);
      }
      if (key.includes("b")) {
        note.addModifier(new Accidental("b"), 0);
      }
      // Styling for validated notes
      if (validatedIndexes[index]) {
        note.setStyle({ fillStyle: "green", strokeStyle: "green" });
      }
      // Styling for current note
      else if (index === currentIndex) {
        if (wrongNote != null) {
          // Red if wrong note was recently played
          note.setStyle({ fillStyle: "red", strokeStyle: "red" });
        } else {
          // Emphasis for current target
          note.setStyle({
            fillStyle: "black",
            strokeStyle: "black",
            shadowColor: "#000",
            shadowBlur: 0, // Removed fuzzy blur
            lineWidth: 2, // Stronger border for the current note
          });
        }
      } else {
        // Default gray for upcoming notes
        note.setStyle({ fillStyle: "#999", strokeStyle: "#999" });
      }

      return note;
    });

    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables(notes);

    new Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);

    // Draw the note names below each note only if the note has been guessed
    notes.forEach((note, index) => {
      if (validatedIndexes[index]) {
        const {note: noteName} = midiToNoteNameAndOctave(sequence[index].midi, sequence[index].accidental); // Regular MIDI name for the note
        const solfeggio = SolfegeByNote[noteName]; // Get solfège name
        console.log("solfeggio", solfeggio, "noteName", noteName);
        const xPosition = note.getAbsoluteX() - 10;

        // Get the Y position for the text (bottom of the note)
        const yPosition = note.getYForBottomText(3); // Text line 3 is typically below the note

        // Set improved font style for better visibility
        context.font = "bold 12px Arial";
        context.fillStyle = "#000"; // Strong black color for text
        // Draw both the solfège and the regular name below the note in "Do / C" format
        context.fillText(`${solfeggio} / ${noteName.split('/')[0] }`, xPosition, yPosition+2);
      }
    });

  }, [sequence, currentIndex, validatedIndexes, wrongNote]);

  return <div ref={containerRef} className="mx-auto mt-4" />;
};

export default NotesStaff;
