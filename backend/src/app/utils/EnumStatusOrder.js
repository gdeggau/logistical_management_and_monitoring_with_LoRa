export default {
  PENDING: {
    value: "PENDING",
    description: "Pedido aguardando para ser colocado em carga.",
  },
  ONCARGO: { value: "ONCARGO", description: "Aguardando a entrega." },
  ONDELIVERY: { value: "ONDELIVERY", description: "Pedido em tranporte." },
  DELIVERED: {
    value: "DELIVERED",
    description: "O pedido foi enetregue.",
  },
  RETURNED: {
    value: "RETURNED",
    description: "O pedido voltou a transportador, colocar em uma nova carga.",
  },
};
