import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import {
  Box,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/core'
import ComponentPreview from '../ComponentPreview'
import { AccordionWhitelist } from '../../../utils/editor'
import { useSelector } from 'react-redux'
import { getAllProps, getChildrenBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { generateId } from '../../../utils/generateId'

const acceptedTypes: ComponentType[] = ['AccordionItem']

const AccordionPreview: React.FC<IPreviewProps> = ({ component }) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, acceptedTypes)
  const props = useSelector(getAllProps)
  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, props)
  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Accordion {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </Accordion>
    </Box>
  )
}

export const AccordionHeaderPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

  const props = useSelector(getAllProps)
  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, props)

  return (
    <AccordionHeader ref={drop(ref)} {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview key={key} componentName={key} />
      ))}
    </AccordionHeader>
  )
}

export const AccordionItemPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

  let boxProps: any = {}

  const props = useSelector(getAllProps)
  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, props)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AccordionItem {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </AccordionItem>
    </Box>
  )
}

export const AccordionPanelPreview = ({ component }: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

  let boxProps: any = {}

  const props = useSelector(getAllProps)
  const componentChildren = useSelector(getChildrenBy(component.id))

  if (isOver)
    componentProps.push({
      id: generateId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = generatePropsKeyValue(componentProps, props)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AccordionPanel {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview key={key} componentName={key} />
        ))}
      </AccordionPanel>
    </Box>
  )
}

export default AccordionPreview
