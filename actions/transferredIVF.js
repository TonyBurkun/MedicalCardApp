export const SET_TRANSFERRED_IVF = 'SET_TRANSFERRED_IVF';

export function setTransferredIVF(transferredIVFValue){
  return {
    type: SET_TRANSFERRED_IVF,
    transferredIVF: transferredIVFValue
  }
}

