import { Action } from '@rematch/core'

export function componentsFilterActions(action: Action) {
  if (
    [
      'components/resetProps',
      'components/updateProp',
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
      'components/deleteProps',
      'components/addProps',
    ].includes(action.type)
  ) {
    return true
  }

  return false
}

export function codeFilterActions(action: Action) {
  if (['code/setPageCode', 'code/setComponentsCode'].includes(action.type)) {
    return true
  }

  return false
}
