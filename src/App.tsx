import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SignupPage } from "./pages/SignupPage";
import LegalPage from "./pages/LegalPage";
import { Editor } from "./pages/Editor/Editor";
import { LoginPage } from "./pages/Login";
import { LoadingCircle } from "./components/icons";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import { useAuth } from "./hooks/useAuth";
import { Dashboard } from "./pages/Dashboard";
import { Designer } from "./pages/EmailDesigner/EmailDesigner";
import { ToolsSelection } from "./pages/ToolsSelection/ToolsSelection";
import { EmailDesignsList } from "./pages/EmailDesignsList/EmailDesignsList";
import { LiveDemo } from "./pages/LiveDemo";
const App: React.FC = () => {
  const { user, isFetchingUser } = useAuth();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  if (isFetchingUser && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Animated Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
        <LoadingCircle />
      </div>
    );
  }
  // TODO:- Please use separate route for edit and create
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/template/editor"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/template/editor/:templateId"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route path="/designer/:templateId" element={<Designer />} />
        <Route path="/public/:templateId" element={<Editor />} />
        <Route
          path="/content-templates"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designs"
          element={
            <ProtectedRoute>
              <EmailDesignsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-demo"
          element={
            <>
              <LiveDemo />
            </>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <ToolsSelection />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/legal" element={<LegalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
