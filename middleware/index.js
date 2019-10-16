import thunk from 'redux-thunk'
import fetchData from './fetchData'
import { applyMiddleware } from 'redux'

export default applyMiddleware(
  thunk,
  fetchData,
)
