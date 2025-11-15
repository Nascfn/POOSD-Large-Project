import { Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import RequireAuth from "./RequireAuth";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {}
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