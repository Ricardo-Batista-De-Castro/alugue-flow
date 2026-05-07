import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardProprietario from './pages/DashboardProprietario';
import DashboardInquilino from './pages/DashboardInquilino';
import Imoveis from './pages/Imoveis';
import Pessoas from './pages/Pessoas';
import Contratos from './pages/Contratos';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard/proprietario"
            element={
              <ProtectedRoute allowedRoles={['proprietario']}>
                <DashboardProprietario />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard/inquilino"
            element={
              <ProtectedRoute allowedRoles={['inquilino']}>
                <DashboardInquilino />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/imoveis"
            element={
              <ProtectedRoute allowedRoles={['proprietario']}>
                <Imoveis />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/pessoas"
            element={
              <ProtectedRoute allowedRoles={['proprietario']}>
                <Pessoas />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/contratos"
            element={
              <ProtectedRoute allowedRoles={['proprietario']}>
                <Contratos />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
