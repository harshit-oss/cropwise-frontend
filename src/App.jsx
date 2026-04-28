// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar   from "./components/Navbar";
import Sidebar  from "./components/Sidebar";

import Home                  from "./pages/Home";
import Dashboard             from "./pages/Dashboard";
import CropRecommendation    from "./pages/CropRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import ChatbotPage           from "./pages/ChatbotPage";
import Login                 from "./pages/Login";
import Signup                from "./pages/Signup";

const WELCOME_MSG = {
  sender: "bot",
  text: "👋 Hi! I'm CropWise AI. Ask me anything about crops, soil, or farming!",
};

// ── Inner app — has access to AuthContext ─────────────────────
function AppInner() {
  const { user, loading } = useAuth();

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("cropwise_chat");
      return saved ? JSON.parse(saved) : [WELCOME_MSG];
    } catch {
      return [WELCOME_MSG];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cropwise_chat", JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  const clearChat = () => setChatMessages([WELCOME_MSG]);

  // Show loading spinner while Firebase checks auth
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontSize: "1.2rem", color: "#2d7a2d",
      }}>
        🌱 Loading CropWise...
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* ── Protected routes — need login ── */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <Sidebar />
              <div style={{
                marginLeft:  "240px",
                padding:     "30px",
                background:  "#f6f7fb",
                minHeight:   "100vh",
              }}>
                <Routes>
                  <Route path="/"           element={<Home />} />
                  <Route path="/dashboard"  element={<Dashboard />} />
                  <Route path="/crop"       element={<CropRecommendation />} />
                  <Route path="/fertilizer" element={<FertilizerRecommendation />} />
                  <Route
                    path="/chatbot"
                    element={
                      <ChatbotPage
                        messages={chatMessages}
                        setMessages={setChatMessages}
                        onClear={clearChat}
                      />
                    }
                  />
                </Routes>
              </div>
            </>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// ── Root App — wraps everything with AuthProvider ─────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;