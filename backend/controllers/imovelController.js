import imovelService from '../services/imovel.service.js';

/**
 * Controller para Imóvel
 * Responsável APENAS por receber requisições HTTP e retornar respostas
 */

export const getImoveis = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const result = await imovelService.getAllImoveis({ page, limit, status });
    
    return res.status(200).json({
      imoveis: result.imoveis,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages
      }
    });
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const getImovelById = async (req, res) => {
  try {
    const { id } = req.params;
    const imovel = await imovelService.getImovelById(id);
    return res.status(200).json(imovel);
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const createImovel = async (req, res) => {
  try {
    const imovel = await imovelService.createImovel(req.body);
    return res.status(201).json({
      message: 'Imóvel cadastrado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao criar imóvel:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const updateImovel = async (req, res) => {
  try {
    const { id } = req.params;
    const imovel = await imovelService.updateImovel(id, req.body);
    return res.status(200).json({
      message: 'Imóvel atualizado com sucesso',
      imovel,
    });
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

export const deleteImovel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await imovelService.deleteImovel(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
