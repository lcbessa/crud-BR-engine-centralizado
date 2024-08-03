export default [
  {
    conditions: {
      all: [
        {
          fact: "reserva",
          operator: "greaterThanInclusive",
          value: 1,
        },
      ],
    },
    event: {
      type: "reserva-valida",
      params: {
        message: "A reserva é válida",
      },
    },
  },
];
