import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import {
  getSelectedComponentId,
  getSelectedPage,
  isChildrenOfCustomComponent,
  getCustomComponents,
} from '../core/selectors/components'
import babelQueries from '../babel-queries/queries'
import { getCode, getAllComponentsCode } from '../core/selectors/code'
import { searchRootCustomComponent } from '../utils/recursive'

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const code = useSelector(getCode)
  const selectedPage = useSelector(getSelectedPage)
  const isCustomComponentUpdate = useSelector(
    isChildrenOfCustomComponent(componentId),
  )
  const componentsCode = useSelector(getAllComponentsCode)
  const customComponents = useSelector(getCustomComponents)
  let rootCustomParent: string = ``

  if (isCustomComponentUpdate) {
    rootCustomParent = searchRootCustomComponent(
      customComponents[componentId],
      customComponents,
    )
  }

  const setValue = (id: string, name: string, value: any) => {
    if (id.length > 0)
      dispatch.components.updateProp({
        componentId,
        id,
        name,
        value,
      })
    const updatedCode = babelQueries.setProp(
      isCustomComponentUpdate ? componentsCode[rootCustomParent] : code,
      {
        componentId,
        propName: name,
        value: value.toString(),
      },
    )
    // update the code
    isCustomComponentUpdate
      ? dispatch.code.setComponentsCode(updatedCode, rootCustomParent)
      : dispatch.code.setPageCode(updatedCode, selectedPage)
  }

  return { setValue }
}
