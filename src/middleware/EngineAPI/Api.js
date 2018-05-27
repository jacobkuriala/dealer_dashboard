import axios from 'axios';
import { filter, find } from 'lodash';

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
    const headers = EngineApi._populateAuthorizationHeader(auth);

    axios.get(
        `${EngineAPIUrl}/dealer_dashboard/orders/${dealerId}?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`, { headers })
      .then(response => {
        done(null,response);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        done(error,null);
      });
  }

    static getDealers(auth, dealerIds, done){
        const headers = EngineApi._populateAuthorizationHeader(auth);

        axios.get(`${EngineAPIUrl}/dealer_dashboard/dealers/`, { headers })
            .then(response => {
                response.data = filter(response.data, (d) => {
                    let foundId = find(dealerIds, (id) =>{
                        return id == d.id;
                    });
                    if (foundId){
                        return true;
                    } else {
                        return false;
                    }
                });
                done(null,response);
            })
            .catch(error => {
                console.log(JSON.stringify(error));
                done(error,null);
            });
    }

  static _populateAuthorizationHeader(auth){
      const { isAuthenticated, getAccessToken,  } = auth;
      if(isAuthenticated()){
          console.log(getAccessToken());
      }
      return isAuthenticated() ? { 'Authorization' : `Bearer ${getAccessToken()}`}: null;
  }
}

