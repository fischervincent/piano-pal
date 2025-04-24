import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import TrainingSessionPage from "@/trainingProgram/pages/TrainingSessionPage";
import UploadPage from "@/Upload/UploadPage";

export const ROUTES = {
  home: () => "/",
  trainingSession: (trainingSessionId: string) =>
    `/session/${trainingSessionId}`,
  upload: () => "/session/new/upload/",
} as const;

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.home()} element={<HomePage />} />
        <Route path={ROUTES.upload()} element={<UploadPage />} />
        <Route
          path={ROUTES.trainingSession(":trainingSessionId")}
          element={<TrainingSessionPage />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
