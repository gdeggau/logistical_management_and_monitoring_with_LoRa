export default {
  PENDING: {
    value: 'PENDING',
    description: 'Novo pedido! Aguardando para ser colocado em uma carga.',
  },
  ONCARGO: { value: 'ONCARGO', description: 'Aguardando entrega.' },
  ONDELIVERY: { value: 'ONDELIVERY', description: 'Pedido em entrega.' },
  DELIVERED: {
    value: 'DELIVERED',
    description: 'Pedido foi entregue.',
  },
  RETURNED: {
    value: 'RETURNED',
    description: 'Pedido retornou, necessário colocar em uma nova carga.',
  },
};
