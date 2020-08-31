export const validationConfig = {
  user: {
    email: {
      length: { max: 320 },
    },
    username: {
      length: { min: 3, max: 15 },
      regex: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,}$/,
    },
    password: {
      length: { min: 3, max: 30 },
    },
  },
  footprint: {
    title: {
      length: { min: 3, max: 50 },
    },
    body: { length: { max: 250 } },
  },
  comment: {
    text: { length: { max: 250 } },
  },
  locationName: { length: { max: 200 } },
};
