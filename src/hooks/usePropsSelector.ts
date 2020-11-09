import { useSelector } from 'react-redux'
import { RootState } from '../core/store'
// import { getDefaultFormProps } from '../utils/defaultProps'
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

    const propsId =
      state.components.present.pages[state.components.present.selectedPage]
        .propsId

    const isChildOfCustomComponent = state.components.present.customComponents[
      selectedId
    ]
      ? true
      : false

    const props = isChildOfCustomComponent
      ? state.components.present.customComponentsProps
      : state.components.present.propsById[propsId]

    const propId = props.byComponentId[selectedId]?.find(
      id => props.byId[id].name === propsName,
    )

    if (propId) {
      const propValue = props.byId[propId].value
      return { propId, propValue }
    }

    return { propId: propsName, propValue: '' }
  })

  return value
}

export default usePropsSelector
