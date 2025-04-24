import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

const MIN_NOTE_HOLD_DURATION = 50 as const; // ms

function getRMS(buffer: Float32Array): number {
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  return Math.sqrt(sumSquares / buffer.length);
}


export function usePitchDetection() {
  const [note, setNote] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const buffer = new Float32Array(1024);
  const pitchDetectorRef = useRef<PitchDetector<Float32Array> | null>(null);
  const lastDetectedNoteRef = useRef<string | null>(null);
  const noteDetectedAtRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const start = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const pitchDetector = PitchDetector.forFloat32Array(1024);
      pitchDetectorRef.current = pitchDetector;

      const update = () => {
        analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = pitchDetector.findPitch(buffer, audioCtx.sampleRate);
        const rms = getRMS(buffer);
        if (clarity > 0.94 && rms > 0.0006 && pitch) {
          const newNote = frequencyToNote(pitch);
          const now = performance.now();

          if (newNote !== lastDetectedNoteRef.current) {
            lastDetectedNoteRef.current = newNote;
            noteDetectedAtRef.current = now;
          } else if (now - noteDetectedAtRef.current > MIN_NOTE_HOLD_DURATION) {
            if (note !== newNote) {
              setNote(newNote);
            }
          }
        }
        animationFrameId = requestAnimationFrame(update);
      };

      update();
    };

    start();

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioCtxRef.current?.close();
    };
  }, []);

  return note;
}

function frequencyToNote(freq: number): string {
  const A4 = 440;
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const semitones = 12 * Math.log2(freq / A4);
  const index = Math.round(semitones) + 9 + 12 * 4;
  const note = notes[index % 12];
  const octave = Math.floor(index / 12);
  return `${note}${octave}`;
}
