export default [
  {
    conditions: {
      all: [
        {
          fact: "user",
          operator: "equal",
          value: "admin",
        },
      ],
    },
    event: {
      type: "admin-access",
      params: {
        message: "Access granted to admin",
      },
    },
  },
];
