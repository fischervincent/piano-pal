import { useEffect, useMemo, useState } from "react";
import NotesStaff from "./NotesStaff";
import { usePitchDetection } from "../hooks/usePitchDetection";
import { noteToMidi } from "../notes";
import {
  buildExpectedMidiSequence,
  TrainingProgram,
} from "../trainingPrograms";

interface TrainerProps {
  program: TrainingProgram;
}

const NOTES_PER_GROUP = 4;

const SKIPPING_TIMEOUT_MS = 3000;

const Trainer = ({ program }: TrainerProps) => {
  const sequence = useMemo(() => buildExpectedMidiSequence(program, 16), [program]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [validatedIndexes, setValidatedIndexes] = useState<boolean[]>(new Array(sequence.length).fill(false));
  const [wrongNote, setWrongNote] = useState<number | null>(null);
  const [skipFeedback, setSkipFeedback] = useState(false);
  const [skipTimeout, setSkipTimeout] = useState<NodeJS.Timeout | null>(null); // Store timeout

  const detectedNote = usePitchDetection();
  const detectedMidi = detectedNote ? noteToMidi(detectedNote) : null;

  const groupStart = Math.floor(currentIndex / NOTES_PER_GROUP) * NOTES_PER_GROUP;
  const groupEnd = groupStart + NOTES_PER_GROUP;

  const currentGroup = sequence.slice(groupStart, groupEnd);
  const currentGroupValidations = validatedIndexes.slice(groupStart, groupEnd);
  const currentIndexInGroup = currentIndex % NOTES_PER_GROUP;

  useEffect(() => {
    if (detectedMidi == null || currentIndex >= sequence.length) return;

    const expected = sequence[currentIndex];
    console.log("Detected note:", detectedMidi, "Expected note:", expected);
    const sameNote = detectedMidi % 12 === expected.midi % 12;
    const sameOctave = Math.floor(detectedMidi / 12) === Math.floor(expected.midi / 12);

    if (sameNote && sameOctave) {
      setValidatedIndexes((prev) => {
        const updated = [...prev];
        updated[currentIndex] = true;
        return updated;
      });


      if ((currentIndex + 1) % NOTES_PER_GROUP === 0) {
        setSkipFeedback(true);
        const timeout = setTimeout(() => {
          setSkipFeedback(false);
          setCurrentIndex((i) => i + 1);
        }, SKIPPING_TIMEOUT_MS);
        setSkipTimeout(timeout);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } else {
      setWrongNote(detectedMidi);
      setTimeout(() => setWrongNote(null), 800);
    }
  }, [detectedMidi, currentIndex, sequence]);

  const handleSkip = () => {
    if (skipTimeout) clearTimeout(skipTimeout);

    setSkipFeedback(false); // Remove the pulse effect
    setCurrentIndex((prev) => prev + NOTES_PER_GROUP); // Move to next sequence
  };

  const handleStartOver = () => {
    setCurrentIndex(0); // Reset the sequence
    setValidatedIndexes(new Array(sequence.length).fill(false)); // Reset the validations
    setSkipFeedback(false); // Reset skip feedback
  };

  const sequenceComplete = currentIndex >= sequence.length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-center">{program.name}</h2>

      {/* Only render NotesStaff if there are notes remaining */}
      {currentIndex < sequence.length && (
        <NotesStaff
          sequence={currentGroup}
          currentIndex={currentIndexInGroup}
          validatedIndexes={currentGroupValidations}
          wrongNote={wrongNote}
        />
      )}

      <div className="flex justify-between mt-4">
        {sequenceComplete ? (
          <button
            onClick={handleStartOver}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Start Over
          </button>
        ) : (
          <button
            onClick={handleSkip}
            className={`bg-yellow-500 text-white py-2 px-4 rounded ${skipFeedback ? 'animate-pulse' : ''}`}
            disabled={skipFeedback && currentIndex >= sequence.length}
          >
            {skipFeedback ? `Skipping in ${SKIPPING_TIMEOUT_MS / 1000}s` : 'Skip'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Trainer;
