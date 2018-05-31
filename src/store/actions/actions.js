import * as actionTypes from './actionTypes';
import { EngineApi } from '../../middleware/EngineAPI/Api';


export const setAuthorization = (auth) => {
    return {
        type: actionTypes.SET_AUTHORIZATION,
        auth: auth
    }
};

export const setAuthorizedDealerIds = (authorizedDealerIds) => {
    return {
        type: actionTypes.SET_AUTHORIZED_DEALERIDS,
            payload: authorizedDealerIds
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




