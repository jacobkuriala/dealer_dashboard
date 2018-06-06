import * as actionTypes from "../actions/actionTypes";

const initialState = {
    pageTitle: ''
};

const reducer = (state = initialState, action) =>{
  switch(action.type){
      case actionTypes.SET_PAGE_TITLE:
          return {
              ...state,
              pageTitle: action.payload
          };
  }
  return state;
};

export default reducer;