import Modal from '../../components/Modal';
import ModalFooter from '../../components/ModalFooter';

const PessoasModal = ({ show, onClose, formData, onChange, onSubmit, editingPessoa, isPending }) => {
  const title = editingPessoa ? 'Editar Pessoa' : 'Nova Pessoa';
  const submitText = editingPessoa ? 'Atualizar' : 'Criar';

  const formId = 'pessoas-form';

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
      show={show}
      onClose={onClose}
      title={title}
      size="xl"
      headerGradient={true}
      footer={footer}
    >
      <form id={formId} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-field">Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">RG</label>
            <input
              type="text"
              name="rg"
              value={formData.rg}
              onChange={onChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Profissão</label>
            <input
              type="text"
              name="profissao"
              value={formData.profissao}
              onChange={onChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Renda Mensal</label>
            <input
              type="number"
              name="rendaMensal"
              value={formData.rendaMensal}
              onChange={onChange}
              className="input-field"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="label-field">Situação</label>
            <select
              name="situacao"
              value={formData.situacao}
              onChange={onChange}
              className="input-field"
              required
            >
              <option value="EM_CADASTRO">Em Cadastro</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </div>
          <div>
            <label className="label-field">Dashboard</label>
            <select
              name="acessoDashboard"
              value={String(formData.acessoDashboard)}
              onChange={onChange}
              className="input-field"
              required
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PessoasModal;
