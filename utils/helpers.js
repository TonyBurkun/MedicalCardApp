import {Dimensions} from 'react-native'

export function isIphone5() {
  const windowHeight = Dimensions.get('window').height;
  return windowHeight === 568;
}
