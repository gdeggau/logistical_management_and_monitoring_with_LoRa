export default {
  PENDING: {
    value: "PENDING",
    description: "Order waiting to be inserted in a cargo.",
  },
  ONCARGO: { value: "ONCARGO", description: "Waiting for delivery." },
  ONDELIVERY: { value: "ONDELIVERY", description: "Order on delivery." },
  DELIVERED: {
    value: "DELIVERED",
    description: "Order was delivered.",
  },
  RETURNED: {
    value: "RETURNED",
    description: "Order returned, provide a new cargo.",
  },
};
