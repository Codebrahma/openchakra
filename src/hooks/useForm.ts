import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { getSelectedComponentId } from '../core/selectors/components'
import babelQueries from '../babel-queries/queries'
import { getCode } from '../core/selectors/code'

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const code = useSelector(getCode)

  const setValue = useCallback(
    (id: string, name: string, value: any) => {
      // Updated the AST tree using babel plugin

      dispatch.components.updateProp({
        componentId,
        id,
        name,
        value,
      })
      const updatedCode = babelQueries.setProp(code, {
        componentId,
        propName: name,
        value,
      })
      // update the code
      dispatch.code.setCode(updatedCode)
    },
    [code, componentId, dispatch.code, dispatch.components],
  )

  return { setValue }
}
