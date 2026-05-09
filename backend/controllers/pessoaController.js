import pessoaService from '../services/pessoa.service.js';

/**
 * Controller para endpoints de Pessoa
 * Responsável APENAS por requisições/respostas HTTP
 */

export const getPessoas = async (req, res) => {
  try {
    const pessoas = await pessoaService.getAllPessoas();
    return res.status(200).json(pessoas);
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    return res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
};

export const getPessoaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pessoa = await pessoaService.getPessoaById(id);
    return res.status(200).json(pessoa);
  } catch (error) {
    console.error('Erro ao buscar pessoa:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createPessoa = async (req, res) => {
  try {
    const pessoa = await pessoaService.createPessoa(req.body);
    return res.status(201).json({
      message: 'Pessoa cadastrada com sucesso',
      pessoa,
    });
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updatePessoa = async (req, res) => {
  try {
    const { id } = req.params;
    const pessoa = await pessoaService.updatePessoa(id, req.body);
    return res.status(200).json({
      message: 'Pessoa atualizada com sucesso',
      pessoa,
    });
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
