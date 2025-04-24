import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import TrainingSessionPage from "@/trainingProgram/pages/TrainingSessionPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:trainingSessionId" element={<TrainingSessionPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
