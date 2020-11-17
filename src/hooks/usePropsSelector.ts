import { useSelector } from 'react-redux'
import { useInspectorUpdate } from '../contexts/inspector-context'
import { useEffect } from 'react'
import { getPropByName } from '../core/selectors/components'

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

  const prop = useSelector(getPropByName(propsName))
  if (prop) return { propId: prop.id, propValue: prop.value }
  return { propId: propsName, propValue: '' }
}

export default usePropsSelector
