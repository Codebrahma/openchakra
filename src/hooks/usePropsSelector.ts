import { useSelector } from 'react-redux'
import { RootState } from '../core/store'
import { getDefaultFormProps } from '../utils/defaultProps'
import { useInspectorUpdate } from '../contexts/inspector-context'
import { useEffect } from 'react'

const usePropsSelector = (propsName: string) => {
  const { addActiveProps } = useInspectorUpdate()

  useEffect(() => {
    // Register form props name for custom props panel
    addActiveProps(propsName)
  }, [addActiveProps, propsName])

  const value = useSelector((state: RootState) => {
    const selectedId = state.components.present.selectedId
    const selectedPage = state.components.present.selectedPage
    const component =
      state.components.present.pages[selectedPage][selectedId] ||
      state.components.present.customComponents[selectedId]
    const propsValue = component.props[propsName]

    if (propsValue !== undefined) {
      return propsValue
    }

    if (getDefaultFormProps(component.type)[propsName] !== undefined) {
      return getDefaultFormProps(component.type)[propsName]
    }

    return ''
  })

  return value
}

export default usePropsSelector
