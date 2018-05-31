import * as actionTypes from "../actions/actionTypes";
import moment from "moment";
import momentz from "moment-timezone";

const DEALER_TIMEZONE = 'America/Los_Angeles';

const fromDate = new Date();
const toDate = new Date();
fromDate.setDate(toDate.getDate() - 31);
let fromDateMoment = moment.tz(fromDate, DEALER_TIMEZONE);
let toDateMoment = moment.tz(toDate, DEALER_TIMEZONE);

const initialState = {
    ordersList: null,
    ordersList_Selected_FromDate: fromDateMoment,
    ordersList_Selected_ToDate: toDateMoment
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.SET_ORDER_LIST:
            return {
                ...state,
                ordersList: action.payload
            };
        case actionTypes.SET_ORDER_LIST_SELECTED_FROMDATE:
            return {
                ...state,
                ordersList_Selected_FromDate: action.payload
            };
        case actionTypes.SET_ORDER_LIST_SELECTED_TODATE:
            return {
                ...state,
                ordersList_Selected_ToDate: action.payload
            };
    }
    return state;
};

export default reducer;