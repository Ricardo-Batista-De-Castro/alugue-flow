const ImoveisModal = ({ show, onClose, formData, onChange, onSubmit, editingImovel, isViewMode, isPending }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-primary-gradient px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {isViewMode ? 'Visualizar Imóvel' : editingImovel ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Identificação */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">
              Identificação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Imóvel</label>
                <input type="text" name="nome" value={formData.nome} onChange={onChange}
                  className="input-field" placeholder="Ex: Apto 101 - Residencial das Flores" disabled={isViewMode} />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={onChange} className="input-field" required disabled={isViewMode}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="comercial">Comercial</option>
                  <option value="terreno">Terreno</option>
                  <option value="chacara">Chácara</option>
                </select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro *</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={onChange}
                  className="input-field" placeholder="Rua, Avenida..." required disabled={isViewMode} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                <input type="text" name="numero" value={formData.numero} onChange={onChange}
                  className="input-field" placeholder="Nº" required disabled={isViewMode} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={onChange}
                  className="input-field" placeholder="00000-000" disabled={isViewMode} />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={onChange}
                  className="input-field" placeholder="Apto, Bloco..." disabled={isViewMode} />
              </div>
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={onChange}
                  className="input-field" placeholder="Bairro" disabled={isViewMode} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={onChange}
                  className="input-field" placeholder="Cidade" required disabled={isViewMode} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">UF *</label>
                <input type="text" name="estado" value={formData.estado} onChange={onChange}
                  className="input-field" placeholder="SP" maxLength="2" required disabled={isViewMode} />
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">
              Características
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                <input type="number" name="quartos" value={formData.quartos} onChange={onChange}
                  className="input-field" placeholder="0" min="0" disabled={isViewMode} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                <input type="number" name="banheiros" value={formData.banheiros} onChange={onChange}
                  className="input-field" placeholder="0" min="0" disabled={isViewMode} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input type="number" name="area" value={formData.area} onChange={onChange}
                  className="input-field" placeholder="0" min="0" step="0.01" disabled={isViewMode} />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Aluguel *</label>
                <input type="number" name="valorAluguel" value={formData.valorAluguel} onChange={onChange}
                  className="input-field" placeholder="0.00" min="0" step="0.01" required disabled={isViewMode} />
              </div>
              <div className="md:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={onChange} className="input-field" disabled={isViewMode}>
                  <option value="disponivel">Disponível</option>
                  <option value="alugado">Alugado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b border-gray-200">
              Observações
            </h3>
            <textarea name="observacoes" value={formData.observacoes} onChange={onChange} rows={3}
              className="input-field resize-none" placeholder="Informações adicionais sobre o imóvel..."
              disabled={isViewMode} />
          </div>

          {/* Botões */}
          {!isViewMode && (
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
              <button type="submit" disabled={isPending} className="btn-primary inline-flex items-center gap-2 disabled:opacity-70">
                {isPending && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isPending ? 'Salvando...' : editingImovel ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
              </button>
            </div>
          )}
          {isViewMode && (
            <div className="flex justify-end pt-2 border-t border-gray-200">
              <button type="button" onClick={onClose} className="btn-secondary">Fechar</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ImoveisModal;
