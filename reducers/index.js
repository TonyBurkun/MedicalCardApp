import {combineReducers} from 'redux'
import authedUser from './authedUser'
import allergicReactions  from './allergicReactions'
import childhoodDiseases  from './childhoodDiseases'
import vaccinations  from './vaccinations'
import pregnancyOutcome  from './pregnancyOutcome'
import gynecologicalDiseases  from './gynecologicalDiseases'
import transferredIVF  from './transferredIVF'
import disability  from './disability'
import badHabits  from './badHabits'
import genitalInfections  from './genitalInfections'
import other  from './other'
import labels  from './labels'
import doctors from './doctors'
import pills from './pills'
import notes from './notes'
import tests from './tests'


export default combineReducers({
  authedUser,
  allergicReactions,
  childhoodDiseases,
  vaccinations,
  pregnancyOutcome,
  gynecologicalDiseases,
  transferredIVF,
  disability,
  badHabits,
  genitalInfections,
  other,
  labels,
  doctors,
  pills,
  notes,
  tests
})
