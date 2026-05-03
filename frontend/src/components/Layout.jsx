import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = user?.tipo === 'proprietario' ? [
    { path: '/dashboard/proprietario', label: 'Dashboard' },
    { path: '/imoveis', label: 'Imóveis' },
    { path: '/inquilinos', label: 'Inquilinos' },
    { path: '/contratos', label: 'Contratos' },
  ] : [
    { path: '/dashboard/inquilino', label: 'Meu Contrato' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">AlugueFlow</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.nome} ({user?.tipo})
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
