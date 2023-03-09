import {store} from './store';
import Toast from 'react-native-simple-toast';
import {REST_URL, REST_PGD, HEADERS_CONFIG} from '../../AppConfig';

export async function getMyRequest(nip) {
  if (nip !== null) {
    let uri = `${REST_URL}/operasional/myrequeststatus.php?nip=${nip}`;
    fetch(uri, HEADERS_CONFIG)
      .then(response => response.json())
      .then(res => {
        if (res.success_msg != null) {
          store.setMyRequestData(res.success_msg);
        } else {
          store.setMyRequestData([]);
        }
      })
      .catch(err => {
        Toast.show(`Error getMyRequest:\n ${err}`, Toast.SHORT);
      });
  }
}

export async function getMyRequestList(nip, jns_kasuskode) {
  let page = store.getPaginationRequest();
  let data = store.getMyRequestListData();
  if (data.length > 0 && data.length < page * 10) {
    store.setEndOfPage(true);
    return false;
  }
  // let uri = `https://demo.securehr.net/webservices1/qp.php?page=${page}`;
  let uri = `${REST_URL}/rest/?method=myrequest&format=json&nip=${nip}&jenis_kasus_kode=${jns_kasuskode}&page=${page}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      let resData = data.concat(res.data);
      store.setMyRequestListData(resData);
    })
    .catch(err => {
      Toast.show(`Error getMyRequestList:\n ${err}`, Toast.SHORT);
    });
}

export async function getMyRequestById(kso_kasusnomor) {
  let uri = `${REST_URL}/rest/?method=RiwayatMyRequest&format=json&kso_kasusnomor=${kso_kasusnomor}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      if (Array.isArray(res.data)) {
        store.setMyRequestById(res.data, kso_kasusnomor);
      } else {
        store.setMyRequestById([], kso_kasusnomor);
      }
    })
    .catch(err => {
      Toast.show(`Error getMyRequestById:\n ${err}`, Toast.SHORT);
    });
}

export async function getTodoList(nip) {
  let uri = `${REST_URL}/operasional/todo_list_index.php?nip=${nip}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      if (res.success_msg != null) {
        store.setTodoListData(res.success_msg);
      } else {
        store.setTodoListData([]);
      }
    })
    .catch(err => {
      Toast.show(`Error getTodoList:\n ${err}`, Toast.SHORT);
    });
}

export async function getJenisTugas() {
  let uri = `${REST_URL}/sppd/jenis_tugas.php`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisTugas(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisTugas:\n ${err}`, Toast.SHORT);
    });
}

export async function getWorklist(nip, jns_kasuskode) {
  let page = store.getPaginationWorklist();
  let data = store.getWorklistData();
  if (data.length > 0 && data.length < page * 10) {
    store.setEndOfPage(true);
    return false;
  }
  let uri = `${REST_URL}/operasional/list.php?nip=${nip}&jnk_jeniskasuskode=${jns_kasuskode}&page=${page}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      if (res.data) {
        let resData = data.concat(res.data);
        store.setWorklistData(resData);
      } else {
        store.setWorklistData([]);
      }
    })
    .catch(err => {
      Toast.show(`Error getWorklist:\n ${err}`, Toast.SHORT);
    });
}

export async function getJenisCuti(nip) {
  let uri = `${REST_URL}/rest/?method=jeniscuti&format=json&nip=${nip}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisCutiData(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisCuti:\n ${err}`, Toast.SHORT);
    });
}

export async function getSaldoCuti(nip, jns_cuti) {
  return new Promise((resolve, reject) => {
    let uri = `${REST_URL}/rest/?method=checksaldo&format=json&nip=${nip}&jns_cuti=${jns_cuti}`;
    fetch(uri, HEADERS_CONFIG)
      .then(response => response.json())
      .then(res => {
        if (res.data) {
          resolve(res.data);
        } else {
          Toast.show(`Error data getJenisCuti`, Toast.SHORT);
        }
      })
      .catch(err => {
        Toast.show(`Error getJenisCuti:\n ${err}`, Toast.SHORT);
        reject(err);
      });
  });
}

export async function getJenisLembur() {
  let uri = `${REST_URL}/rest/?method=JenisLembur&format=json`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisLemburData(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisLembur:\n ${err}`, Toast.SHORT);
    });
}

export async function getJenisKlaim(nip, rei_id) {
  let param2 = '';
  if (rei_id !== undefined) {
    param2 = 'true&rei_id=' + rei_id;
  } else {
    param2 = 'false';
  }

  let uri = `${REST_URL}/reimbursement/jenis_reimbursement.php?nip=${nip}&detail=${param2}`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisKlaim(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisKlaim:\n ${err}`, Toast.SHORT);
    });
}

export function getJenisBerkas() {
  fetch(`${REST_URL}/reimbursement/berkas.php`, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisBerkas(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisBerkas:\n ${err}`, Toast.SHORT);
    });
}

export async function getJenisDispen() {
  let uri = `${REST_URL}/absensi/?method=JenisDispensasi&format=json`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setJenisDispen(res.data);
    })
    .catch(err => {
      Toast.show(`Error getJenisKlaim:\n ${err}`, Toast.SHORT);
    });
}

export async function getFeatureData() {
  let uri = `${REST_PGD}/FeatureCheck.php`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      store.setFeatureData(res.response);
    })
    .catch(err => {
      Toast.show(`Error getFeatureData:\n ${err}`, Toast.SHORT);
    });
}

export async function getImageBanner() {
  // let uri = `${REST_PGD}/get_banner.php`;
  // fetch(uri, HEADERS_CONFIG)
  //   .then(response => response.json())
  //   .then(res => {
  //     const dataObjImage = [];
  //     for (const row of res){
  //       dataObjImage.push({url: row['banner'], go_to : row['url']});
  //     }
  //     store.setImageBanner(dataObjImage);
  //   })
  //   .catch(err => {
  //     Toast.show(`Error getImageBanner:\n ${err}`, Toast.SHORT);
  //   });
  try {
    let uri = `${REST_URL}/banner`;
    fetch(uri, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
    })
      .then(response => response.json())
      .then(res => {
        const dataObjImage = [];
        try {
          for (const row of res.values) {
            dataObjImage.push({url: row.file, go_to: row.url});
          }
        } catch (e) {
          console.log(e);
        }
        store.setImageBanner(dataObjImage);
      })
      .catch(err => {
        Toast.show(`Error getImageBanner:\n ${err}`, Toast.SHORT);
      });
  } catch (e) {
    console.log(e);
  }
}

export async function getNewImageBanner() {
  let uri = `${REST_URL}/banner`;
  fetch(uri, HEADERS_CONFIG)
    .then(response => response.json())
    .then(res => {
      const dataObjImage = [];
      for (const row of res['values']) {
        console.log(row);
        // dataObjImage.push({url: row['file'], go_to : ''});
      }
      store.setImageBanner(dataObjImage);
    })
    .catch(err => {
      Toast.show(`Error getNewImageBanner:\n ${err}`, Toast.SHORT);
    });
}
