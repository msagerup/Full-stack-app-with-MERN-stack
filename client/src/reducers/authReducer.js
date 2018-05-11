const initialState = {
  isAuthenticated: false,
  user: {
    hello: "there"
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
