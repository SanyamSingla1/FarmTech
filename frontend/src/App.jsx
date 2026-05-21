import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
//import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import CropDashboard from "./pages/CropDashboard";
import CropRecommendations from "./pages/CropRecommendations";
import Profile from "./pages/Profile";
import TaskScheduler from "./pages/TaskScheduler";
import Chatbot from "./pages/Chatbot";
import DiseaseDetection from "./pages/DiseaseDetection";
import IrrigationAlerts from "./pages/IrrigationAlerts";
import FertilizerRecommendations from "./pages/FertilizerRecommendations";
//import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import CropCycle from "./pages/CropCycle";
import Weather from "./pages/Weather";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<Route
            path="/weather"
            element={
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/crops"
            element={
              <ProtectedRoute>
                <CropDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-recommendations"
            element={
              <ProtectedRoute>
                <CropRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskScheduler />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disease-detection"
            element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/irrigation"
            element={
              <ProtectedRoute>
                <IrrigationAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fertilizer"
            element={
              <ProtectedRoute>
                <FertilizerRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-cycle"
            element={
              <ProtectedRoute>
                <CropCycle />
              </ProtectedRoute>
            }
          />
          {/* <Route
  path="/crop-cycle"
  element={<CropCycle />}
/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}