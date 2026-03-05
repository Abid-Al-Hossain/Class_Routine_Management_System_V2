import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
