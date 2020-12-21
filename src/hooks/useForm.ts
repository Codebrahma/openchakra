import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import {
  getSelectedComponentId,
  getSelectedPage,
} from '../core/selectors/components'
import babelQueries from '../babel-queries/queries'
import { getCode } from '../core/selectors/code'

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)

  const setValue = useCallback(
    (id: string, name: string, value: any) => {
      dispatch.components.updateProp({
        componentId,
        id,
        name,
        value,
      })
      const updatedCode = babelQueries.setProp(code, {
        componentId,
        propName: name,
        value: value.toString(),
      })
      // update the code
      dispatch.code.setPageCode(updatedCode, selectedPage)
    },
    [code, componentId, dispatch.code, dispatch.components, selectedPage],
  )

  return { setValue }
}
