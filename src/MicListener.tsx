import React, { useEffect, useRef, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToNoteName } from './noteUtils';

const MicListener: React.FC = () => {
  const [note, setNote] = useState<string | null>(null);
  const [solfege, setSolfege] = useState<string | null>(null);
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Float32Array;
    let source: MediaStreamAudioSourceNode;
    let rafId: number;

    const updatePitch = () => {
      analyser.getFloatTimeDomainData(dataArray);
      const [pitch, clarity] = detectorRef.current!.findPitch(dataArray, audioContext.sampleRate);

      if (clarity > 0.8 && pitch > 80 && pitch < 1000) {
        const { note, solfege } = frequencyToNoteName(pitch);
        setNote(note);
        setSolfege(solfege);
      }

      rafId = requestAnimationFrame(updatePitch);
    };

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Float32Array(analyser.fftSize);
      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);

      updatePitch();
    });

    return () => {
      cancelAnimationFrame(rafId);
      audioContext?.close();
    };
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">🎶 Note Detector</h1>
      {note ? (
        <div className="mt-4">
          <p className="text-xl">Note: {note}</p>
          <p className="text-xl">Solfege: {solfege}</p>
        </div>
      ) : (
        <p className="mt-4">Listening…</p>
      )}
    </div>
  );
};

export default MicListener;
