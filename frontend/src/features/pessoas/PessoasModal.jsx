const PessoasModal = ({ show, onClose, formData, onChange, onSubmit, editingPessoa, isPending }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Nome Completo</label>
              <input type="text" name="nome" value={formData.nome} onChange={onChange} className="input-field" required/>
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" name="email" value={formData.email} onChange={onChange} className="input-field" required/>
            </div>
            <div>
              <label className="label-field">Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={onChange} className="input-field" required/>
            </div>
            <div>
              <label className="label-field">CPF</label>
              <input type="text" name="cpf" value={formData.cpf} onChange={onChange} className="input-field" required/>
            </div>
            <div>
              <label className="label-field">RG</label>
              <input type="text" name="rg" value={formData.rg} onChange={onChange} className="input-field" required/>
            </div>
            <div>
              <label className="label-field">Profissão</label>
              <input type="text" name="profissao" value={formData.profissao} onChange={onChange} className="input-field"/>
            </div>
            <div>
              <label className="label-field">Renda Mensal</label>
              <input type="number" name="rendaMensal" value={formData.rendaMensal} onChange={onChange} className="input-field" step="0.01" min="0" required/>
            </div>
            <div>
              <label className="label-field">Situação</label>
              <select name="situacao" value={formData.situacao} onChange={onChange} className="input-field" required>
                <option value="EM_CADASTRO">Em Cadastro</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </div>
            <div>
              <label className="label-field">Dashboard</label>
              <select name="acessoDashboard" value={String(formData.acessoDashboard)} onChange={onChange} className="input-field" required>
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-70">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Salvando...
                </span>
              ) : editingPessoa ? 'Atualizar' : 'Criar'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PessoasModal;
