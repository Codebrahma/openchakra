import { ComponentsState } from './components'
import {
  checkIsChildOfCustomComponent,
  updateInAllInstances,
  loadRequired,
  addCustomPropsInAllComponentInstances,
} from '../../../utils/reducerUtilities'
import {
  moveComp,
  searchRootCustomComponent,
  deleteCustomPropInRootComponent,
} from '../../../utils/recursive'

export const moveComponent = (
  draftState: ComponentsState,
  payload: {
    componentId: string
    newParentId: string
    oldParentId: string
  },
) => {
  const { componentId, newParentId, oldParentId } = payload
  const { propsId, componentsId } = loadRequired(draftState, componentId)

  if (checkIsChildOfCustomComponent(componentId, draftState.customComponents)) {
    draftState.customComponents[componentId].parent = newParentId

    //remove the componentId from children of old parent
    draftState.customComponents[oldParentId].children.splice(
      draftState.customComponents[oldParentId].children.indexOf(componentId),
      1,
    )
    const {
      updatedSourceComponents: updatedCustomComponents,
      updatedSourceProps: updatedCustomComponentProps,
      movedProps,
      movedComponents,
    } = moveComp(
      componentId,
      draftState.customComponents,
      draftState.customComponentsProps,
    )

    //moved from custom component to another custom component
    if (
      checkIsChildOfCustomComponent(newParentId, draftState.customComponents)
    ) {
      //Add the componentId in the children of new parent
      draftState.customComponents[newParentId].children.push(componentId)

      //When moved from one custom component to another custom component
      //The custom prop should be deleted from the old root parent and must be updated in the new root parent.
      const rootCustomParent = searchRootCustomComponent(
        draftState.customComponents[newParentId],
        draftState.customComponents,
      )

      Object.keys(movedProps).forEach(componentId => {
        movedProps[componentId]
          .filter(
            prop => prop.derivedFromPropName && prop.derivedFromComponentType,
          )
          .forEach(exposedProp => {
            //An copy of exposed prop before changing the derived from component-id
            const exposedPropCopy = { ...exposedProp }
            const index = draftState.customComponentsProps[
              componentId
            ].findIndex(prop_ => prop_.id === exposedProp.id)

            draftState.customComponentsProps[componentId][
              index
            ].derivedFromComponentType = rootCustomParent

            const {
              updatedCustomComponentProps,
              updatedPropsById,
              updatedComponentsById,
              updatedCustomComponents,
            } = deleteCustomPropInRootComponent(
              exposedPropCopy,
              draftState.pages,
              draftState.componentsById,
              draftState.customComponents,
              draftState.propsById,
              draftState.customComponentsProps,
            )
            draftState.propsById = { ...updatedPropsById }
            draftState.customComponentsProps = {
              ...updatedCustomComponentProps,
            }
            draftState.componentsById = { ...updatedComponentsById }
            draftState.customComponents = { ...updatedCustomComponents }
            const isCustomPropPresent = draftState.customComponentsProps[
              rootCustomParent
            ].findIndex(prop => prop.name === exposedProp.derivedFromPropName)

            if (isCustomPropPresent === -1) {
              updateInAllInstances(
                draftState.pages,
                draftState.componentsById,
                draftState.customComponents,
                draftState.customComponents[rootCustomParent].type,
                (
                  component: IComponent,
                  updateInCustomComponent: Boolean,
                  propsId: string,
                ) => {
                  addCustomPropsInAllComponentInstances({
                    exposedProp: {
                      name: exposedProp.name,
                      value: exposedProp.value,
                      customPropName: exposedProp.derivedFromPropName || '',
                    },
                    exposedPropComponentType:
                      draftState.customComponents[exposedProp.componentId].type,
                    component,
                    componentsId,
                    propsId,
                    updateInCustomComponent,
                    draftState,
                  })
                },
              )
            }
          })
      })
    }
    //moved from custom component to components data
    else {
      draftState.componentsById[componentsId] = {
        ...draftState.componentsById[componentsId],
        ...movedComponents,
      }
      draftState.customComponents = { ...updatedCustomComponents }
      draftState.componentsById[componentsId][componentId].parent = newParentId
      //Add the componentId in the children of new parent
      draftState.componentsById[componentsId][newParentId].children.push(
        componentId,
      )

      //update the derivedFromComponentType to null for the moved props.
      Object.keys(movedProps).forEach(componentId => {
        movedProps[componentId] = movedProps[componentId].map(prop => {
          if (prop.derivedFromPropName && prop.derivedFromComponentType)
            return { ...prop, derivedFromComponentType: null }
          return prop
        })
      })

      draftState.propsById[propsId] = {
        ...draftState.propsById[propsId],
        ...movedProps,
      }

      draftState.customComponentsProps = { ...updatedCustomComponentProps }

      //deletion of custom props for all the exposed props.

      Object.keys(movedProps).forEach(componentId => {
        movedProps[componentId]
          .filter(prop => prop.derivedFromPropName)
          .forEach(customProp => {
            const {
              updatedCustomComponentProps,
              updatedPropsById,
              updatedComponentsById,
              updatedCustomComponents,
            } = deleteCustomPropInRootComponent(
              customProp,
              draftState.pages,
              draftState.componentsById,
              draftState.customComponents,
              draftState.propsById,
              draftState.customComponentsProps,
            )
            draftState.propsById = { ...updatedPropsById }
            draftState.customComponentsProps = {
              ...updatedCustomComponentProps,
            }
            draftState.componentsById = { ...updatedComponentsById }
            draftState.customComponents = { ...updatedCustomComponents }
          })
      })
    }
  } else {
    const isCustomComponentChild = checkIsChildOfCustomComponent(
      newParentId,
      draftState.customComponents,
    )

    //moved from components data to the custom component
    if (isCustomComponentChild) {
      const rootCustomParent = searchRootCustomComponent(
        draftState.customComponents[newParentId],
        draftState.customComponents,
      )

      //one instance of custom component can not be moved into another instance of same custom component
      if (
        draftState.customComponents[rootCustomParent].type ===
        draftState.componentsById[componentsId][componentId].type
      )
        return draftState

      //remove the componentId from children of old parent
      draftState.componentsById[componentsId][oldParentId].children.splice(
        draftState.componentsById[componentsId][oldParentId].children.indexOf(
          componentId,
        ),
        1,
      )

      const {
        updatedSourceComponents: updatedComponents,
        updatedSourceProps: updatedProps,
        movedComponents,
        movedProps,
      } = moveComp(
        componentId,
        draftState.componentsById[componentsId],
        draftState.propsById[propsId],
      )
      draftState.componentsById[componentsId] = { ...updatedComponents }
      draftState.customComponents = {
        ...draftState.customComponents,
        ...movedComponents,
      }
      draftState.customComponents[componentId].parent = newParentId
      //Add the componentId in the children of new parent
      draftState.customComponents[newParentId].children.push(componentId)

      draftState.propsById[propsId] = { ...updatedProps }

      Object.keys(movedProps).forEach(componentId => {
        movedProps[componentId] = movedProps[componentId].map(prop => {
          if (prop.derivedFromPropName)
            return { ...prop, derivedFromComponentType: rootCustomParent }
          return prop
        })
      })

      draftState.customComponentsProps = {
        ...draftState.customComponentsProps,
        ...movedProps,
      }

      //Add custom props for all the instances of the custom components only when there is no similar prop present
      //Also add the box if the children for the box component is exposed.

      Object.keys(movedProps).forEach(componentId => {
        movedProps[componentId]
          .filter(prop => prop.derivedFromPropName)
          .forEach(exposedProp => {
            const isPropPresent = draftState.customComponentsProps[
              rootCustomParent
            ].findIndex(prop => prop.name === exposedProp.derivedFromPropName)
            if (isPropPresent === -1) {
              updateInAllInstances(
                draftState.pages,
                draftState.componentsById,
                draftState.customComponents,
                draftState.customComponents[rootCustomParent].type,
                (
                  component: IComponent,
                  updateInCustomComponent: Boolean,
                  propsId: string,
                  componentsId: string,
                ) => {
                  addCustomPropsInAllComponentInstances({
                    exposedProp: {
                      name: exposedProp.name,
                      value: exposedProp.value,
                      customPropName: exposedProp.derivedFromPropName || '',
                    },
                    exposedPropComponentType:
                      draftState.customComponents[exposedProp.componentId].type,
                    component,
                    componentsId,
                    propsId,
                    updateInCustomComponent,
                    draftState,
                  })
                },
              )
            }
          })
      })
    }

    //moved inside the components data
    else {
      //remove the componentId from children of old parent
      draftState.componentsById[componentsId][oldParentId].children.splice(
        draftState.componentsById[componentsId][oldParentId].children.indexOf(
          componentId,
        ),
        1,
      )
      draftState.componentsById[componentsId][componentId].parent = newParentId

      //Add the componentId in the children of new parent
      draftState.componentsById[componentsId][newParentId].children.push(
        componentId,
      )
    }
  }
  draftState.selectedId = componentId
}
