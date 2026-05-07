import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import logo from '../assets/logo_AlugueFlow.png';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Inicializa estados diretamente do localStorage para manter a preferência mesmo após recarregar a página
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('menuPinned');
    return saved === 'true';
  });
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('menuPinned');
    return saved !== 'true';
  });
  const [hoveredItem, setHoveredItem] = useState(null);

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

  // Ícones SVG para cada item do menu
  const icons = {
    dashboard: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    imoveis: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    inquilinos: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    contratos: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    meuContrato: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  const menuItems = user?.tipo === 'proprietario' ? [
    { path: '/dashboard/proprietario', label: 'Dashboard', icon: icons.dashboard },
    { path: '/imoveis', label: 'Imóveis', icon: icons.imoveis },
    { path: '/pessoas', label: 'Pessoas', icon: icons.inquilinos },
    { path: '/contratos', label: 'Contratos', icon: icons.contratos },
  ] : [
    { path: '/dashboard/inquilino', label: 'Meu Contrato', icon: icons.meuContrato },
  ];

  // Auto-collapse ao clicar em item SOMENTE se não estiver pinado
  const handleMenuItemClick = () => {
    // Mobile: sempre fecha o menu
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false);
      return;
    }
    
    // Desktop: Se está pinado, não faz absolutamente nada
    if (isPinned) {
      return;
    }
    
    // Desktop não pinado: recolhe o menu
    setIsCollapsed(true);
  };

  // Garantir que o menu permaneça expandido quando pinado
  useEffect(() => {
    if (isPinned) {
      setIsCollapsed(false);
    }
  }, [isPinned]);

  // Salvar preferência de pin no localStorage
  const togglePin = (e) => {
    e?.stopPropagation();
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem('menuPinned', newPinned.toString());
    
    // Se despinadou, força o menu a recolher
    if (!newPinned) {
      setIsCollapsed(true);
    } else {
      // Se pinou, força o menu a expandir
      setIsCollapsed(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-gradient shadow-sm sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-4">
          <div className="grid grid-cols-3 items-center h-14">
            {/* Coluna Esquerda - Botão Hambúrguer */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-white"
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
            </div>
            
            {/* Coluna Centro - Logo */}
            <div className="flex items-center justify-center">
              <img 
                src={logo} 
                alt="AlugueFlow" 
                className="h-10 md:h-12"
              />
            </div>
            
            {/* Coluna Direita - Nome e Botão Sair */}
            <div className="flex items-center justify-end space-x-2 md:space-x-4">
              <span className="text-xs md:text-base text-white font-medium">
                <span className="md:hidden">{getInitials(user?.nome)}</span>
                <span className="hidden md:inline">
                  {user?.nome} ({user?.tipo})
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium rounded-lg text-xs md:text-sm px-2 py-1.5 md:px-4 md:py-2 whitespace-nowrap transition-all duration-300"
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

        {/* Sidebar Desktop */}
        <aside
          className={`
            hidden md:block
            fixed left-0 top-16 z-50
            ${isPinned ? 'w-64' : (isCollapsed ? 'w-16' : 'w-64')}
            bg-white shadow-lg
            h-[calc(100vh-4rem-48px)]
            ${isPinned ? '' : 'transition-all duration-300 ease-in-out'}
            overflow-hidden
          `}
        >
          {/* Botão de Toggle e Pin */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <button
              onClick={() => {
                if (!isPinned) {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              className={`p-2 rounded-lg transition-colors ${isPinned ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              title={isPinned ? 'Menu fixado - use o pino para desafixar' : (isCollapsed ? 'Expandir menu' : 'Recolher menu')}
              disabled={isPinned}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {(!isCollapsed || isPinned) && (
              <button
                onClick={togglePin}
                className={`p-2 rounded-lg transition-all ${isPinned ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 text-gray-400'}`}
                title={isPinned ? 'Desafixar menu' : 'Fixar menu'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v8l-2 2v2h5v5c0 .55.45 1 1 1s1-.45 1-1v-5h5v-2l-2-2z"/>
                </svg>
              </button>
            )}
          </div>

          <nav className="p-2 space-y-1 pb-6">
            {menuItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => {
                  // Só muda hoveredItem se o menu estiver recolhido e não pinado (para mostrar tooltip)
                  if (isCollapsed && !isPinned) {
                    setHoveredItem(item.path);
                  }
                }}
                onMouseLeave={() => {
                  // Só limpa hoveredItem se o menu estiver recolhido e não pinado
                  if (isCollapsed && !isPinned) {
                    setHoveredItem(null);
                  }
                }}
              >
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary-gradient text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className={`whitespace-nowrap transition-opacity duration-300 ${isCollapsed && !isPinned ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
                
                {/* Tooltip quando recolhido */}
                {isCollapsed && !isPinned && hoveredItem === item.path && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        <aside
          className={`
            md:hidden
            fixed left-0 top-16 z-50
            w-64 bg-white shadow-lg
            h-[calc(100vh-4rem-48px)]
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-2 pb-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-primary-gradient text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 w-full pb-20 ${isPinned ? '' : 'transition-all duration-300'} ${isPinned ? 'md:ml-64' : (isCollapsed ? 'md:ml-16' : 'md:ml-64')}`}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-primary-gradient text-white fixed bottom-0 right-0 left-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-3 relative">
            {/* Frase institucional centralizada */}
            <div className="text-sm md:text-base font-medium text-center">
              Sua plataforma de gestão inteligente de aluguéis
            </div>

            {/* Versão à direita */}
            <div className="text-sm absolute right-0">
              Versão: 1.0.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
