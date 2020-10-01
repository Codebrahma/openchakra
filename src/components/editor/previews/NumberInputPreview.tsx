import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/core'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const NumberInputPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const { drop } = useDropComponent(
    component.id,
    undefined,
    false,
    boundingPosition,
  )

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <NumberInput {...propsKeyValue} ref={drop(ref)}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

export default NumberInputPreview
