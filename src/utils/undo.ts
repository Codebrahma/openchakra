import { Action } from '@rematch/core'

export default function filterActions(action: Action) {
  if (
    [
      'components/resetProps',
      'components/updateProps',
      'components/addComponent',
      'components/deleteComponent',
      'components/moveComponent',
      'components/addMetaComponent',
      'components/moveSelectedComponentChildren',
      'components/duplicate',
      'components/saveComponent',
      'components/exposeProp',
      'components/unexpose',
      'components/deleteCustomProp',
      'components/deleteCustomComponent',
      'components/resetComponents',
      'components/updateTextChildrenProp',
      'components/addSpan',
      'components/removeSpan',
    ].includes(action.type)
  ) {
    return true
  }

  return false
}
