import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { getSelectedComponentId } from '../core/selectors/components'

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)

  const setValue = useCallback(
    (id: string, name: string, value: any) => {
      dispatch.components.updateProp({
        componentId,
        id,
        name,
        value,
      })
    },
    [componentId, dispatch.components],
  )

  return { setValue }
}
