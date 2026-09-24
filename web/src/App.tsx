import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProblemLibrary from './pages/ProblemLibrary';
import Workspace from './pages/Workspace';
import History from './pages/History';
import Feedback from './pages/Feedback';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import ProblemDetail from './pages/ProblemDetail';
import LearningPage from './pages/LearningPage';
import AttemptDetail from './pages/AttemptDetail';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

            <Route path="/problems" element={<ProblemLibrary />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />

            <Route path="/attempts" element={<History />} />
            <Route path="/attempts/:id" element={<AttemptDetail />} />
            <Route path="/attempts/:id/feedback" element={<Feedback />} />
            <Route path="/history" element={<Navigate to="/attempts" replace />} />

            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/practice/:id" element={<Workspace />} />

            <Route path="/learning/:topic" element={<LearningPage />} />

            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in h-[60vh]">
                <h2 className="text-2xl font-bold text-white mb-2">404 - Not Found</h2>
                <p className="text-gray-400 text-sm">The route you explored does not exist in this domain.</p>
              </div>
            } />
          </Routes>
        </AppShell>
      } />
    </Routes>
  );
}

export default App;

