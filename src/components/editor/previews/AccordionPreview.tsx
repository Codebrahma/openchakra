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
import { getChildrenBy } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'
import { generateId } from '../../../utils/generateId'

const acceptedTypes: ComponentType[] = ['AccordionItem']

const AccordionPreview: React.FC<IPreviewProps> = ({
  component,
  customProps,
}) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, acceptedTypes)
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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)
  let boxProps: any = {}

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <Accordion {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </Accordion>
    </Box>
  )
}

export const AccordionHeaderPreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <AccordionHeader ref={drop(ref)} {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={customProps}
        />
      ))}
    </AccordionHeader>
  )
}

export const AccordionItemPreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

  let boxProps: any = {}

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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AccordionItem {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </AccordionItem>
    </Box>
  )
}

export const AccordionPanelPreview = ({
  component,
  customProps,
}: IPreviewProps) => {
  const { props: componentProps, ref } = useInteractive(component, true)
  const { drop, isOver } = useDropComponent(component.id, AccordionWhitelist)

  let boxProps: any = {}

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

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <AccordionPanel {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </AccordionPanel>
    </Box>
  )
}

export default AccordionPreview
