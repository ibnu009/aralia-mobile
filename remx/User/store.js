import * as remx from 'remx'

const initialState = {
  user: {},
  config: {},
  quesioner: {}
}

const state = remx.state(initialState)

const getters = remx.getters({
  getUserData() {
    return state.user
  },
  getConfigData() {
    return state.config
  },
  getQuesionerData() {
    return state.quesioner
  },
})

const setters = remx.setters({
  setUserData(payload) {
    state.user = payload
  },
  setConfigData(payload) {
    state.config = payload
  },
  setQuesionerData(payload) {
    state.quesioner = payload
  },
})

export const store = {
  ...getters,
  ...setters
}
