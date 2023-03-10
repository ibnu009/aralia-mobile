import * as remx from 'remx';

const initalState = {
  data: [],
  loading: true,
  month: null,
  year: null,
  token: ''
};

const state = remx.state(initalState);

const getters = remx.getters({
  getData() {
    return state.data;
  },

  isLoading() {
    return state.loading;
  },

  getMonth() {
    return state.month;
  },

  getYear() {
    return state.year;
  },

  getToken() {
    return state.token;
  },
});

const setters = remx.setters({
  setData(payload?: Object) {
    state.data = payload;
    state.loading = false;
  },

  setLoading(b?: Boolean) {
    state.loading = b;
  },

  setMonth(month?: Number) {
    state.month = month;
  },

  setYear(year?: Number) {
    state.year = year;
  },

  setToken(token ?: String) {
    state.token = token;
  },
});

export const store = {
  ...getters,
  ...setters,
};
