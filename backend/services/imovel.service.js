import imovelRepository from '../repositories/imovel.repository.js';

/**
 * Service para lógica de negócio de Imóvel
 * Responsável por validações, regras de negócio e orquestração
 */
class ImovelService {
  /**
   * Busca todos os imóveis com paginação e filtro
   */
  async getAllImoveis(options = {}) {
    return await imovelRepository.findAll(options);
  }

  /**
   * Busca imóvel por ID
   * @throws {Error} Se imóvel não encontrado
   */
  async getImovelById(id) {
    const imovel = await imovelRepository.findById(id);

    if (!imovel) {
      const error = new Error('Imóvel não encontrado');
      error.statusCode = 404;
      throw error;
    }

    return imovel;
  }

  /**
   * Cria um novo imóvel com validações
   * @throws {Error} Se validações falharem
   */
  async createImovel(data) {
    const {
      nome,
      tipo,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      quartos,
      banheiros,
      area,
      valorAluguel,
      status,
    } = data;

    // Validação de campos obrigatórios
    if (!nome || !tipo || !endereco || !numero || !bairro || !cidade || !estado || !cep || !valorAluguel) {
      const error = new Error('Todos os campos obrigatórios devem ser preenchidos');
      error.statusCode = 400;
      throw error;
    }

    // Validar valor do aluguel
    const valorAluguelNum = parseFloat(valorAluguel);
    this._validateValorAluguel(valorAluguelNum);

    // Preparar dados para criação
    const imovelData = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      endereco: endereco.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cep: cep.trim(),
      valorAluguel: valorAluguelNum,
      status: status || 'disponivel',
    };

    // Adicionar campos opcionais se fornecidos
    if (complemento) imovelData.complemento = complemento.trim();
    if (quartos) imovelData.quartos = parseInt(quartos);
    if (banheiros) imovelData.banheiros = parseInt(banheiros);
    if (area) imovelData.area = parseFloat(area);

    const imovel = await imovelRepository.create(imovelData);
    return imovel;
  }

  /**
   * Atualiza um imóvel existente
   * @throws {Error} Se imóvel não encontrado ou validações falharem
   */
  async updateImovel(id, data) {
    const {
      nome,
      tipo,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      quartos,
      banheiros,
      area,
      valorAluguel,
      status,
    } = data;

    // Verificar se imóvel existe
    const exists = await imovelRepository.exists(id);
    if (!exists) {
      const error = new Error('Imóvel não encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Preparar dados para atualização
    const updateData = {};

    if (nome !== undefined) updateData.nome = nome.trim();
    if (tipo !== undefined) updateData.tipo = tipo.trim();
    if (endereco !== undefined) updateData.endereco = endereco.trim();
    if (numero !== undefined) updateData.numero = numero.trim();
    if (complemento !== undefined) updateData.complemento = complemento ? complemento.trim() : null;
    if (bairro !== undefined) updateData.bairro = bairro.trim();
    if (cidade !== undefined) updateData.cidade = cidade.trim();
    if (estado !== undefined) updateData.estado = estado.trim();
    if (cep !== undefined) updateData.cep = cep.trim();
    if (quartos !== undefined) updateData.quartos = quartos ? parseInt(quartos) : null;
    if (banheiros !== undefined) updateData.banheiros = banheiros ? parseInt(banheiros) : null;
    if (area !== undefined) updateData.area = area ? parseFloat(area) : null;
    // IMPORTANTE: O status do imóvel é gerenciado automaticamente pela lógica de contratos
    // Não permitir edição manual do status
    // if (status !== undefined) updateData.status = status;

    if (valorAluguel !== undefined) {
      const valorAluguelNum = parseFloat(valorAluguel);
      this._validateValorAluguel(valorAluguelNum);
      updateData.valorAluguel = valorAluguelNum;
    }

    const imovel = await imovelRepository.update(id, updateData);
    return imovel;
  }

  /**
   * Exclui um imóvel
   * @throws {Error} Se imóvel não encontrado ou tiver contratos ativos
   */
  async deleteImovel(id) {
    const imovel = await imovelRepository.findByIdWithActiveContratos(id);

    if (!imovel) {
      const error = new Error('Imóvel não encontrado');
      error.statusCode = 404;
      throw error;
    }

    if (imovel.contratos && imovel.contratos.length > 0) {
      const error = new Error('Não é possível excluir imóvel com contratos ativos');
      error.statusCode = 400;
      throw error;
    }

    await imovelRepository.delete(id);
    return { message: 'Imóvel excluído com sucesso' };
  }

  /**
   * Valida se o valor do aluguel é válido
   * @private
   */
  _validateValorAluguel(valor) {
    if (isNaN(valor) || valor <= 0) {
      const error = new Error('Valor do aluguel inválido');
      error.statusCode = 400;
      throw error;
    }
  }
}

export default new ImovelService();
