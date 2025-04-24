import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom'
import { TrainingProgram } from "@/trainingProgram/trainingPrograms";

export const TrainingSessionCard = ({
  title,
  description,
  difficulty,
  duration,
  id: trainingSessionId,
}: {
  title: string;
  description: string;
  difficulty: TrainingProgram["difficulty"];
  duration: string;
  id: string;
}) => {
  const difficultyColor = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  }[difficulty];

  return (
    <Card key={"TSCard-" + trainingSessionId}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {duration}
        </div>
        <Button size="sm" variant="primary" asChild>
          <Link to={`/session/${trainingSessionId}`}>Start</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
  