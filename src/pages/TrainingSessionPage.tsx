import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

type Params = {
  trainingSessionId: string;
};

const TrainingSessionPage: React.FC = () => {
  const { trainingSessionId } = useParams<Params>();
  const [currentNote] = useState<string>('C4');

  return (
    <div>
      <h1>Session {trainingSessionId}</h1>
      <p>Practice this note: {currentNote}</p>
      {/* Implement MIDI listener and feedback */}
    </div>
  );
};

export default TrainingSessionPage;
