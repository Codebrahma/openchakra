import { useSelector } from 'react-redux'
import { useTheme } from '@chakra-ui/core'
import { getCustomTheme } from '../core/selectors/app'
import mergeObject from '../utils/mergeObject'

const useCustomTheme = () => {
  const customTheme = useSelector(getCustomTheme)
  const theme = useTheme()
  return customTheme ? mergeObject(theme, customTheme) : theme
}

export default useCustomTheme
