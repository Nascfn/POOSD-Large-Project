import { Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import RequireAuth from "./RequireAuth";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/please-verify" element={<VerifyEmail />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route 
          path="/homepage" 
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;