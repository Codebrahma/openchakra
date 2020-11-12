import { useSelector } from 'react-redux'
import { RootState } from '../core/store'
// import { getDefaultFormProps } from '../utils/defaultProps'
import { useInspectorUpdate } from '../contexts/inspector-context'
import { useEffect } from 'react'

/**
 * @typedef {Object} Prop
 * @property {string} propId - Prop id
 * @property {string} propValue - Prop value
 */

/**
 * @method
 * @name usePropsSelector
 * @description This use hook function will return the id and value of the selected component with the help of name
 * @param   {string} propsName  Prop name
 * @return   {Prop}
 */

const usePropsSelector = (propsName: string) => {
  const { addActiveProps } = useInspectorUpdate()

  useEffect(() => {
    // Register form props name for custom props panel
    addActiveProps(propsName)
  }, [addActiveProps, propsName])

  const prop = useSelector((state: RootState) => {
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

  return prop
}

export default usePropsSelector
