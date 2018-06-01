import * as actionTypes from './actionTypes';
import { EngineApi } from '../../middleware/EngineAPI/Api';


// TODO: consider separating out actions based on reducers and reconcile using an index.js

export const setAuthorization = (auth) => {
    return {
        type: actionTypes.SET_AUTHORIZATION,
        auth: auth
    }
};

export const setSelectedAuthorizedDealerId = (dealerId) => {
    return {
        type: actionTypes.SET_SELECTED_AUTHORIZED_DEALERID,
        payload: dealerId
    }
};

export const setAuthorizedDealers = (dealers) => {
    return {
        type: actionTypes.SET_AUTHORIZED_DEALERS,
        payload: dealers
    }
}

export const fetchAuthorizedDealers = (auth, dealerIds) => {
    return dispatch => {
        EngineApi.getDealers(auth, dealerIds, (error, response) => {
            if (error) {
                dispatch(setAuthorizedDealers([]));
                console.log(error);
                return;
            }
            dispatch(setAuthorizedDealers(response.data));
        });
    };
};

export const setAuthorizedDealerIds = (authorizedDealerIds) => {
    return {
        type: actionTypes.SET_AUTHORIZED_DEALERIDS,
        payload: authorizedDealerIds
    }
};

export const fetchAuthorizedDealerIds = (auth) => {
    return dispatch => {
        auth.getProfile((error,user)=> {
            const dealerIds = user["http://localhost:3013/user_metadata"].dealerIds;
            if (dealerIds) {
                dispatch(setAuthorizedDealerIds(dealerIds));
                dispatch(setSelectedAuthorizedDealerId(dealerIds[0]));
                dispatch(fetchAuthorizedDealers(auth, dealerIds));
            }
        });
    }
};

export const setOrdersList = (orders) => {
    return {
        type: actionTypes.SET_ORDER_LIST,
        payload: orders
    }
};

export const fetchOrdersList = (auth, dealerId, fromDateUTC, toDateUTC) => {
    return dispatch => {
        EngineApi.getOrders(auth, dealerId,
            fromDateUTC, toDateUTC, (error, response) => {
                if (error) {
                    dispatch(setOrdersList([]));
                    console.log(error);
                    return;
                }
                dispatch(setOrdersList(response.data));
            });
    };
};

export const setSelectedOrderDetail = (orderDetail) => {
    return {
        type: actionTypes.SET_SELECTED_ORDER_DETAIL,
        payload: orderDetail
    }
};

export const fetchSelectedOrderDetail = (auth, selectedOrderId) => {
    return dispatch => {
        EngineApi.getOrderDetails(auth, selectedOrderId, (error, response)=>{
            if(error){
                dispatch(setSelectedOrderDetail({}));
                console.log(error);
                return;
            }
            dispatch(setSelectedOrderDetail(response.data))
        });
    }
};

export const setOrdersListSelectedFromDate = (fromDate) =>{
  return {
      type: actionTypes.SET_ORDER_LIST_SELECTED_FROMDATE,
      payload: fromDate
  }
};

export const setOrdersListSelectedToDate = (toDate) =>{
    return {
        type: actionTypes.SET_ORDER_LIST_SELECTED_TODATE,
        payload: toDate
    }
};





