import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { seedMockDataIfNeeded } from "./utils/mockData";
import { Home } from "./pages/Home";
import { CoordinatorDashboard } from "./pages/CoordinatorDashboard";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { RepresentativeDashboard } from "./pages/RepresentativeDashboard";
import { PageTransition } from "./components/PageTransition";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/coordinator"
          element={
            <PageTransition>
              <CoordinatorDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/teacher"
          element={
            <PageTransition>
              <TeacherDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/student"
          element={
            <PageTransition>
              <StudentDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/representative"
          element={
            <PageTransition>
              <RepresentativeDashboard />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    const seeded = seedMockDataIfNeeded();
    if (seeded) {
      // Reload once to ensure all Zustand stores sync up with the newfound populated localStorage
      window.location.reload();
    }
  }, []);

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
