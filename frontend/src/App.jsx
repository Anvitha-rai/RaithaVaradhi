// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import Seasons    from "./pages/Seasons";
import Expenses   from "./pages/Expenses";
import Income     from "./pages/Income";
// Add this import at the top
import SmartInsights from "./pages/SmartInsights";
import Fields from "./pages/Fields";



// Add this route inside <Routes>


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Navigate to="/login" />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/seasons"   element={<PrivateRoute><Seasons /></PrivateRoute>} />
          <Route path="/expenses"  element={<PrivateRoute><Expenses /></PrivateRoute>} />
          <Route path="/income"    element={<PrivateRoute><Income /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><SmartInsights /></PrivateRoute>} />
         
<Route path="/fields" element={<Fields />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}