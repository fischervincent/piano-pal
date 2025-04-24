import { useParams } from "react-router-dom";
import { usePitchDetection } from "../hooks/usePitchDetection";
import { TRAINING_PROGRAMS } from "../trainingPrograms";
import { Music } from "lucide-react";
import Trainer from "../components/Trainer";
import { TrainingSessionCard } from "../components/TrainingSessionCard";

export default function SessionPage() {
  const { trainingSessionId } = useParams();
  const trainingProgram = TRAINING_PROGRAMS.find(
    (program) => program.id === trainingSessionId
  );
  if (!trainingProgram) {
    return <div>Training program not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
          <Music className="w-8 h-8 text-indigo-500" /> Note Reading Practice
        </h1>

        <Trainer program={trainingProgram} />
      </div>
      <span className="text-center text-gray-500 mb-4">
        <span className="text-gray-400">or</span>
        <span className="text-gray-800"> choose another training session</span>
      </span>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {TRAINING_PROGRAMS.map((program) => (
          <TrainingSessionCard
            key={program.id}
            title={program.name}
            description={program.description}
            difficulty={program.difficulty}
            duration="5 min"
            id={program.id}
          />
        ))}
      </div>
    </div>
  );
}
