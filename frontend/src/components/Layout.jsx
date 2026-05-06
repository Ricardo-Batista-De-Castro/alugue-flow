import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import logo from '../assets/logo_AlugueFlow.png';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Função para obter as iniciais do nome
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Botão Hambúrguer - Apenas Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              
              <img 
                src={logo} 
                alt="AlugueFlow" 
                className="h-20 md:h-27"
              />
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-xs md:text-base text-gray-700 font-medium">
                <span className="md:hidden">{getInitials(user?.nome)}</span>
                <span className="hidden md:inline">
                  {user?.nome} ({user?.tipo})
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-xs md:text-sm px-2 py-1.5 md:px-4 md:py-2 whitespace-nowrap"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Backdrop Mobile */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden top-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-16 z-50
            w-64 bg-white shadow-lg
            h-[calc(100vh-4rem)]
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-2 pb-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
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
        <main className="flex-1 p-4 md:p-8 w-full md:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
