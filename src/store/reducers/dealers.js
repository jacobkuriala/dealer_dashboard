import * as actionTypes from "../actions/actionTypes";

const initialState = {
    selectedDealerId: '',
    authorizedDealers: [] ,
    authorizedDealerIds: []
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_AUTHORIZED_DEALERIDS:
            return {
                ...state,
                authorizedDealerIds: action.payload
            };
        case actionTypes.SET_SELECTED_AUTHORIZED_DEALERID:
            return {
                ...state,
                selectedDealerId: action.payload
            };
        case actionTypes.SET_AUTHORIZED_DEALERS:
            return {
                ...state,
                authorizedDealers: action.payload
            }
    }
    return state;
};

export default reducer;