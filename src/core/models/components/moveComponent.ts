import { ComponentsState } from './components'
import { checkIsChildOfCustomComponent } from '../../../utils/reducerUtilities'

/**
 * @typedef {Object} moveComponentPayload
 * @property {string} componentId Id of the component to be moved
 * @property {string} newParentId Id of the parent to which the component to moved
 * @property {string} oldParentId Id of the old parent from which the component is present before moved
 */

/**
 * @method
 * @name moveComponent
 * @description This function will handle the moving of selected component from one parent to another parent.
 * @param {ComponentsState} draftState workspace state
 * @param {moveComponentPayload} payload
 */

export const moveComponent = (
  draftState: ComponentsState,
  payload: {
    componentId: string
    newParentId: string
    oldParentId: string
  },
) => {
  const { componentId, newParentId, oldParentId } = payload

  // Moved a component inside a custom component
  if (checkIsChildOfCustomComponent(componentId, draftState.customComponents)) {
    draftState.customComponents[oldParentId].children.splice(
      draftState.customComponents[oldParentId].children.indexOf(componentId),
      1,
    )
    draftState.customComponents[componentId].parent = newParentId

    //Add the componentId in the children of new parent
    draftState.customComponents[newParentId].children.push(componentId)
  }

  //moved a component inside normal page editor
  else {
    //remove the componentId from children of old parent
    draftState.components[oldParentId].children.splice(
      draftState.components[oldParentId].children.indexOf(componentId),
      1,
    )
    draftState.components[componentId].parent = newParentId

    //Add the componentId in the children of new parent
    draftState.components[newParentId].children.push(componentId)
  }

  draftState.selectedId = componentId
}
