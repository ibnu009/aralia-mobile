// @flow
import * as remx from 'remx';

const initialState = {
  todoListData: [],
  requestData: [],
  worklistData: [],
  paginationWorklist: 1,
  requestListData: [],
  paginationRequest: 1,
  requestDetail: [],
  jenisCuti: [],
  jenisLembur: [],
  selectedPeg: {},
  selectedPosisi: {},
  jenisTugas: [],
  jenisKlaim: [],
  jenisBerkas: [],
  jenisDispen: [],
  selectedCity: [],
  featureData: {},
  imageBanner: [],
  isEndOfPage: false,
};

const state = remx.state(initialState);

const getters = remx.getters({
  getTodoListData() {
    return state.todoListData;
  },

  getMyRequestData() {
    return state.requestData;
  },

  getWorklistData() {
    return state.worklistData;
  },

  getPaginationWorklist() {
    return state.paginationWorklist
  },

  getMyRequestListData() {
    return state.requestListData;
  },

  getPaginationRequest() {
    return state.paginationRequest
  },

  getMyRequestById() {
    return state.requestDetail;
  },

  getJenisCutiData() {
    return state.jenisCuti;
  },

  getJenisLemburData() {
    const data = state.jenisLembur;
    let result = [];
    data.map(e => {
      const ket_lembur = e.ket_lembur.toLowerCase().split(' ');
      let b = '';
      ket_lembur.map(a => {
        b += a.substr(0, 1).toUpperCase() + a.substr(1, a.length - 1) + ' ';
      });
      e.ket_lembur = b;

      result.push(e);
    });
    return result;
  },

  getSelectedPeg() {
    return state.selectedPeg;
  },

  getSelectedPosisi() {
    return state.selectedPosisi;
  },

  getJenisTugas() {
    return state.jenisTugas;
  },

  getJenisKlaim() {
    return state.jenisKlaim;
  },

  getJenisBerkas() {
    return state.jenisBerkas;
  },

  getJenisDispen() {
    return state.jenisDispen;
  },

  getSelectedCity() {
    return state.selectedCity;
  },

  getFeatureData() {
    return state.featureData;
  },

  getImageBanner() {
    return state.imageBanner;
  },
  
  isEndOfPage() {
    return state.isEndOfPage;
  }
});

const setters = remx.setters({
  setTodoListData(payload?: Object) {
    state.todoListData = payload;
  },

  setMyRequestData(payload?: Object) {
    state.requestData = payload;
  },

  setMyRequestById(payload?: Object, kso?: String) {
    let isFound = false;
    state.requestDetail.map(e => {
      if (e.kso == kso) {
        isFound = !isFound;
        e.data = payload;
        return false;
      }
    });
    if (!isFound)
      state.requestDetail = [...state.requestDetail, { kso: kso, data: payload }];
  },

  setWorklistData(payload?: Object) {
    state.worklistData = payload;
  },

  setPaginationWorklist(page?: Number) {
    state.paginationWorklist = page
  },

  setMyRequestListData(payload?: Object) {
    state.requestListData = payload;
  },

  setPaginationRequest(page?: Number) {
    state.paginationRequest = page
  },

  setJenisCutiData(payload?: Object) {
    state.jenisCuti = payload;
  },

  setJenisLemburData(payload?: Object) {
    state.jenisLembur = payload;
  },

  setSelectedPeg(payload?: Object) {
    state.selectedPeg = payload;
  },

  setSelectedPosisi(payload?: Object) {
    state.selectedPosisi = payload;
  },

  setJenisTugas(payload?: Object) {
    state.jenisTugas = payload;
  },

  setJenisKlaim(payload?: Object) {
    state.jenisKlaim = payload;
  },

  setJenisBerkas(payload?: Object) {
    state.jenisBerkas = payload;
  },

  setJenisDispen(payload?: Object) {
    state.jenisDispen = payload;
  },

  setSelectedCity(payload?: Object, clear?: Boolean) {
    if (clear === undefined) {
      clear = false;
    }

    if (clear == true) {
      state.selectedCity = payload;
    } else {
      let key = Object.keys(payload);
      if (state.selectedCity.length > 0) {
        state.selectedCity.map((k, i) => {
          let currKey = Object.keys(k);
          if (currKey[0] == key[0]) {
            state.selectedCity[i][key[0]] = payload[key[0]];
          } else {
            state.selectedCity.push(payload);
          }
        });
      } else {
        state.selectedCity.push(payload);
      }
      state.selectedCity = state.selectedCity.slice(0, 2);
    }
  },

  setFeatureData(payload?: Object) {
    state.featureData = payload;
  },

  setImageBanner(images?: Object) {
    state.imageBanner = images;
  },

  setEndOfPage(isEndOfPage?: Boolean) {
    state.isEndOfPage = isEndOfPage
  }
});

export const store = {
  ...setters,
  ...getters,
};
