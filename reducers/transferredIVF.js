import {SET_TRANSFERRED_IVF} from '../actions/transferredIVF'

const initialState = {
  transferredIVF: false,
};

function transferredIVF (state = initialState, action) {

  switch (action.type) {
    case SET_TRANSFERRED_IVF:
      return {
        ...state,
        transferredIVF: action.transferredIVF
      };
    default:
      return state
  }
}

export default transferredIVF;
