import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_AlugueFlow.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLocatario, setIsLocatario] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginLocatario } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    
    if (isLocatario) {
      // Login como locatário (email + CPF)
      result = await loginLocatario(email, senha);
      if (result.success) {
        navigate('/dashboard/locatario');
      }
    } else {
      // Login como proprietário (email + senha)
      result = await login(email, senha);
      if (result.success) {
        navigate('/dashboard/proprietario');
      }
    }

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="bg-white rounded-lg shadow-xl px-8 py-1">
          <div className="text-center mb-2">
            <img 
              src={logo} 
              alt="AlugueFlow" 
              className="h-38 mx-auto"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">Entrar</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="block text-gray-700 font-medium mb-1.5">
                {isLocatario ? 'CPF' : 'Senha'}
              </label>
              <input
                type={isLocatario ? 'text' : 'password'}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                placeholder={isLocatario ? 'Digite seu CPF (apenas números)' : '••••••••'}
                required
              />
            </div>

            <div className="mb-5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocatario}
                  onChange={(e) => {
                    setIsLocatario(e.target.checked);
                    setSenha(''); // Limpa o campo ao trocar
                  }}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Sou locatário
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
