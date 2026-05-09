import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import DashboardProprietario from './features/dashboard/DashboardProprietario';
import DashboardLocatario from './features/dashboard/DashboardLocatario';
import Imoveis from './features/imoveis/Imoveis';
import Pessoas from './features/pessoas/Pessoas';
import Contratos from './features/contratos/Contratos';

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
            path="/dashboard/locatario"
            element={
              <ProtectedRoute allowedRoles={['locatario']}>
                <DashboardLocatario />
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
