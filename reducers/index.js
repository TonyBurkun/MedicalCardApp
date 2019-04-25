import {combineReducers} from 'redux'
import authedUser from './authedUser'
import childhoodDiseases  from './childhoodDiseases'


export default combineReducers({
  authedUser,
  childhoodDiseases,
})
