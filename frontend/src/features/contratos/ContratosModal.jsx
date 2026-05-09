import Modal from '../../components/Modal';
import ModalFooter from '../../components/ModalFooter';
import { useImoveis } from '../imoveis/useImoveis';
import { usePessoas } from '../pessoas/usePessoas';

const ContratosModal = ({ editingContrato, formData, onChange, onClose, onSubmit, isPending }) => {
  const { data: imoveis = [] } = useImoveis();
  const { data: pessoas = [] } = usePessoas();

  const title = editingContrato ? 'Editar Contrato' : 'Novo Contrato';
  const submitText = editingContrato ? 'Atualizar' : 'Criar';

  const formId = 'contratos-form';

  const handleImovelChange = (e) => {
    // Sempre atualiza o imovelId
    onChange(e);

    // Ao selecionar um imóvel, autopreenche o valor do aluguel a partir do cadastro do imóvel
    const selectedId = e.target.value;
    const imovel = imoveis.find((i) => i.id === selectedId);

    if (imovel?.valorAluguel != null && imovel.valorAluguel !== '') {
      onChange({
        target: {
          name: 'valorAluguel',
          value: String(imovel.valorAluguel),
        },
      });
    }
  };

  const footer = (
    <ModalFooter
      onCancel={onClose}
      onSubmit={onSubmit}
      formId={formId}
      submitText={submitText}
      isPending={isPending}
    />
  );

  return (
    <Modal
      show={true}
      onClose={onClose}
      title={title}
      size="xl"
      headerGradient={true}
      footer={footer}
    >
      <form id={formId} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Imóvel</label>
            <select
              name="imovelId"
              value={formData.imovelId}
              onChange={handleImovelChange}
              className="input-field"
              required
            >
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
            <select
              name="pessoaId"
              value={formData.pessoaId}
              onChange={onChange}
              className="input-field"
              required
            >
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
            <input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">Data de Término</label>
            <input
              type="date"
              name="dataFim"
              value={formData.dataFim}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label-field">Valor do Aluguel</label>
            <input
              type="number"
              name="valorAluguel"
              value={formData.valorAluguel}
              onChange={onChange}
              className="input-field"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="label-field">Dia de Vencimento</label>
            <input
              type="number"
              name="diaVencimento"
              value={formData.diaVencimento}
              onChange={onChange}
              className="input-field"
              min="1"
              max="31"
              required
            />
          </div>

          <div>
            <label className="label-field">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="input-field"
              required
            >
              <option value="ativo">Ativo</option>
              <option value="encerrado">Encerrado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="label-field">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={onChange}
              className="input-field"
              rows="3"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ContratosModal;
