export const validationConfig = {
  user: {
    email: {
      length: { max: 320 },
    },
    username: {
      length: { min: 3, max: 15 },
      regex: /[a-zA-Z]/,
    },
    password: {
      length: { min: 3, max: 30 },
    },
  },
  footprint: {
    title: {
      length: { min: 3, max: 50 },
    },
    body: { length: { max: 150 } },
  },
};
