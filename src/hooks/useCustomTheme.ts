import { useSelector } from 'react-redux'
import { useTheme, extendTheme } from '@chakra-ui/core'
import { getCustomTheme } from '../core/selectors/app'

const useCustomTheme = () => {
  const customTheme = useSelector(getCustomTheme)
  const theme = useTheme()
  return customTheme ? extendTheme(customTheme) : theme
}

export default useCustomTheme
