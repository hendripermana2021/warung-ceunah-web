import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

import HerokuLandingPage from "./components/HerokuLandingPage";
import FoodStands from "./components/FoodStands";
import MobileLayout from "./layout/MobileLayout";
import PageNotFound from "./components/PageNotFound";
import LocationPage from "./components/LocationPage";
import ContactPage from "./components/ContactPage";

/* 🔥 Retro animation variant */
const retroPage = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    transition: { duration: 0.25 },
  },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MobileLayout />}>
          <Route
            path="/"
            element={
              <motion.div {...retroPage}>
                <HerokuLandingPage />
              </motion.div>
            }
          />

          <Route
            path="/food"
            element={
              <motion.div {...retroPage}>
                <FoodStands />
              </motion.div>
            }
          />

          <Route
            path="/location"
            element={
              <motion.div {...retroPage}>
                <LocationPage />
              </motion.div>
            }
          />

          <Route
            path="/contact"
            element={
              <motion.div {...retroPage}>
                <ContactPage />
              </motion.div>
            }
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <motion.div {...retroPage}>
              <PageNotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
