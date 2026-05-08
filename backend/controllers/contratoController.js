import contratoService from '../services/contrato.service.js';

/**
 * Controller para Contrato
 * Responsável APENAS por receber requisições HTTP e retornar respostas
 */

export const getContratos = async (req, res) => {
  try {
    const { status } = req.query;
    const contratos = await contratoService.getAllContratos(status);
    return res.status(200).json(contratos);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const getContratoById = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await contratoService.getContratoById(id);
    return res.status(200).json(contrato);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createContrato = async (req, res) => {
  try {
    const contrato = await contratoService.createContrato(req.body);
    return res.status(201).json({
      message: 'Contrato criado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await contratoService.updateContrato(id, req.body);
    return res.status(200).json({
      message: 'Contrato atualizado com sucesso',
      contrato,
    });
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contratoService.deleteContrato(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao excluir contrato:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
