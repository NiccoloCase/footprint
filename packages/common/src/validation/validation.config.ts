export const ValidationConfig = {
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
};
