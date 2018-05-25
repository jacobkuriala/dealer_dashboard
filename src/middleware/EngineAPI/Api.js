import axios from 'axios';
import { EngineAPIUrl } from './../Auth/auth0-variables';

export class EngineApi {

  static getTestPublicApi(done) {
    axios.get(`${EngineAPIUrl}/api/public`)
      .then(response => done(response.data.message))
      .catch(error => done(error.message));
  }

  static getTestPrivateApi(auth, done) {
    const { isAuthenticated, getAccessToken,  } = auth;
    const headers = isAuthenticated() ? { 'Authorization' : `Bearer ${getAccessToken()}`}: null;

    axios.get(`${EngineAPIUrl}/api/private`, { headers })
      .then(response => done(response.data.message))
      .catch(error => {
        console.log(JSON.stringify(error));
        done(error.message);
      });
  }

  static getOrders(auth, dealerId, fromDate, toDate, done) {
    const { isAuthenticated, getAccessToken,  } = auth;
    const headers = isAuthenticated() ? { 'Authorization' : `Bearer ${getAccessToken()}`}: null;
    if(isAuthenticated()){
      console.log(getAccessToken());
    }

    axios.get(`${EngineAPIUrl}/dealer_dashboard/orders/${dealerId}?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`, { headers })
      .then(response => {
        console.log(response);
        done(null,response);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        done(error,null);
      });
  }
}

