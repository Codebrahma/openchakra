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
    const componentsId =
      state.components.present.pages[state.components.present.selectedPage]
        .componentsId
    const propsId =
      state.components.present.pages[state.components.present.selectedPage]
        .propsId
    let component: IComponent
    let componentProps: IProp[]

    if (state.components.present.customComponents[selectedId]) {
      component = state.components.present.customComponents[selectedId]
      componentProps =
        state.components.present.customComponentsProps[selectedId]
    } else {
      component =
        state.components.present.componentsById[componentsId][selectedId]
      componentProps = state.components.present.propsById[propsId][selectedId]
    }

    let propsValue = componentProps
      ? componentProps.find(prop => prop.name === propsName)?.value
      : undefined

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
