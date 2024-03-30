import NetInfo from '@react-native-community/netinfo';

class ApiContainer {
  usertype = 'driver';

  getApi = async (url, status) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if (status != 1) {
            global.props.showLoader();
          }
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: 0,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'user-type': this.usertype,
            },
          })
            .then(response => {
              global.props.hideLoader();
              if (response.status === 423) {
                alert('Must update app version first');
              } else {
                return response.json();
              }
            })
            .then(obj => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch(error => {
              global.props.hideLoader();
              reject(error);
            });
        } else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      });
    });
  };
  postApi = async (url, data, status) => {
    global.props.showLoader();

    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if (status != 1) {
            global.props.showLoader();
          }
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: 0,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'user-type': this.usertype,
            },
            body: data,
          })
            .then(response => {
              global.props.hideLoader();
              if (response.status === 423) {
                alert('Must update app version first');
              } else {
                return response.json();
              }
            })
            .then(obj => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch(error => {
              global.props.hideLoader();
              reject(error);
            });
        } else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      });
    });
  };
  NoLoaderpostApi = async (url, data) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: 0,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
              'user-type': this.usertype,
            },
            body: data,
          })
            .then(response => {
              global.props.hideLoader();
              if (response.status === 423) {
                alert('Must update app version first');
              } else {
                return response.json();
              }
            })
            .then(obj => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch(error => {
              global.props.hideLoader();
              reject(error);
            });
        } else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      });
    });
  };
}

//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
