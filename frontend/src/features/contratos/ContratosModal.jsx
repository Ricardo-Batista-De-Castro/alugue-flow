import { useImoveis } from '../imoveis/useImoveis';
import { usePessoas } from '../pessoas/usePessoas';
import { useCreateContrato, useUpdateContrato } from './useContratos';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const ContratosModal = ({ editingContrato, formData, onChange, onClose, onSubmit }) => {
  const { data: imoveis = [] } = useImoveis();
  const { data: pessoas = [] } = usePessoas();
  const createContrato = useCreateContrato();
  const updateContrato = useUpdateContrato();

  const isPending = createContrato.isPending || updateContrato.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingContrato ? 'Editar Contrato' : 'Novo Contrato'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Imóvel</label>
              <select name="imovelId" value={formData.imovelId} onChange={onChange} className="input-field" required>
                <option value="">Selecione um imóvel</option>
                {imoveis.map((imovel) => (
                  <option key={imovel.id} value={imovel.id}>
                    {imovel.endereco} - {imovel.cidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Pessoa</label>
              <select name="pessoaId" value={formData.pessoaId} onChange={onChange} className="input-field" required>
                <option value="">Selecione uma pessoa</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Data de Início</label>
              <input type="date" name="dataInicio" value={formData.dataInicio} onChange={onChange} className="input-field" required />
            </div>

            <div>
              <label className="label-field">Data de Término</label>
              <input type="date" name="dataFim" value={formData.dataFim} onChange={onChange} className="input-field" required />
            </div>

            <div>
              <label className="label-field">Valor do Aluguel</label>
              <input type="number" name="valorAluguel" value={formData.valorAluguel} onChange={onChange} className="input-field" step="0.01" min="0" required />
            </div>

            <div>
              <label className="label-field">Dia de Vencimento</label>
              <input type="number" name="diaVencimento" value={formData.diaVencimento} onChange={onChange} className="input-field" min="1" max="31" required />
            </div>

            <div>
              <label className="label-field">Status</label>
              <select name="status" value={formData.status} onChange={onChange} className="input-field" required>
                <option value="ativo">Ativo</option>
                <option value="encerrado">Encerrado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Observações</label>
              <textarea name="observacoes" value={formData.observacoes} onChange={onChange} className="input-field" rows="3" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Salvando...
                </span>
              ) : editingContrato ? (
                'Atualizar'
              ) : (
                'Criar'
              )}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContratosModal;
