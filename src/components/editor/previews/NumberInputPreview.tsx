import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from '@chakra-ui/core'
import { useSelector } from 'react-redux'

import ComponentPreview from '../ComponentPreview'
import { getChildrenBy } from '../../../core/selectors/components'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'

export const NumberInputPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const acceptedTypes = [
    'NumberInputField',
    'NumberInputStepper',
    'NumberIncrementStepper',
    'NumberDecrementStepper',
  ] as ComponentType[]
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop } = useDropComponent(
    component.id,
    acceptedTypes,
    false,
    boundingPosition,
  )
  let boxProps: any = {}

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )
  const componentChildren = useSelector(getChildrenBy(component.id))

  return (
    <Box ref={drop(ref)} {...boxProps}>
      <NumberInput {...propsKeyValue}>
        {componentChildren.map((key: string) => (
          <ComponentPreview
            key={key}
            componentName={key}
            customProps={customProps}
          />
        ))}
      </NumberInput>
    </Box>
  )
}

export const NumberInputFieldPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps } = useInteractive(component, true)

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  return <NumberInputField {...propsKeyValue} />
}

export const NumberInputStepperPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps } = useInteractive(component, false)

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )
  const componentChildren = useSelector(getChildrenBy(component.id))

  return (
    <NumberInputStepper {...propsKeyValue}>
      {componentChildren.map((key: string) => (
        <ComponentPreview
          key={key}
          componentName={key}
          customProps={customProps}
        />
      ))}
    </NumberInputStepper>
  )
}

export const NumberIncrementStepperPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps } = useInteractive(component, true)

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  return <NumberIncrementStepper {...propsKeyValue} />
}

export const NumberDecrementStepperPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps } = useInteractive(component, true)

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  return <NumberDecrementStepper {...propsKeyValue} />
}
