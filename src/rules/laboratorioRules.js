export default [
  {
    conditions: {
      all: [
        {
          fact: "laboratorio",
          operator: "equal",
          value: "aberto",
        },
      ],
    },
    event: {
      type: "laboratorio-aberto",
      params: {
        message: "O laboratório está aberto",
      },
    },
  },
];
