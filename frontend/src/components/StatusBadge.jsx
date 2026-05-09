const StatusBadge = ({
  status,
  colorMap = {},
  defaultColor = "gray"
}) => {
  // Mapa de cores padrão
  const defaultColorMap = {
    // Status de Pessoas e Contratos
    'Ativo': 'green',
    'Inativo': 'red',
    'Encerrado': 'red',
    'Pendente': 'yellow',
    
    // Status de Imóveis
    'Disponível': 'green',
    'Alugado': 'blue',
    'Manutenção': 'yellow',
    'Indisponível': 'red'
  };

  // Mescla o mapa customizado com o padrão
  const finalColorMap = { ...defaultColorMap, ...colorMap };
  
  // Obtém a cor baseada no status
  const color = finalColorMap[status] || defaultColor;

  // Classes de cores para cada variante
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    pink: 'bg-pink-100 text-pink-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  const colorClass = colorClasses[color] || colorClasses.gray;

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
