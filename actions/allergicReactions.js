export const SET_ALLERGIC_REACTIONS = 'SET_ALLERGIC_REACTIONS';




export function setAllergicReactions(allergicReactionsString){
  return {
    type: SET_ALLERGIC_REACTIONS,
    allergicReactions: allergicReactionsString
  }
}
