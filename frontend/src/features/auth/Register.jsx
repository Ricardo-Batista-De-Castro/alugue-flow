import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo_AlugueFlow.png';

const Register = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar se as senhas coincidem
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem. Por favor, verifique e tente novamente.');
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard/proprietario');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <img 
              src={logo} 
              alt="AlugueFlow" 
              className="h-32 mx-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Conta</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="input-field"
                placeholder="João Silva"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="telefone" className="block text-gray-700 font-medium mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="input-field"
                placeholder="(11) 98765-4321"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="block text-gray-700 font-medium mb-2">
                Senha *
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-2">
                Confirmar Senha *
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`input-field ${
                  formData.confirmarSenha && formData.senha !== formData.confirmarSenha
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                placeholder="••••••••"
                required
                minLength={6}
              />
              {formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
                <p className="text-xs text-red-600 mt-1">As senhas não coincidem</p>
              )}
              {formData.confirmarSenha && formData.senha === formData.confirmarSenha && (
                <p className="text-xs text-green-600 mt-1">✓ As senhas coincidem</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
