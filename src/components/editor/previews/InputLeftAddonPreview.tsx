import React from 'react'
import { Box, InputLeftAddon } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const InputLeftAddonPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref } = useInteractive(component)
  const boxProps: any = {}

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box {...boxProps} ref={ref}>
      <InputLeftAddon {...propsKeyValue} />
    </Box>
  )
}

export default InputLeftAddonPreview
