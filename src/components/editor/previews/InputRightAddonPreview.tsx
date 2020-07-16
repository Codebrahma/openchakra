import React from 'react'
import { Box, InputRightAddon } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const InputRightAddonPreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref } = useInteractive(component)
  const boxProps: any = {}

  const propsKeyValue = generatePropsKeyValue(componentProps, customProps)

  return (
    <Box {...boxProps} ref={ref}>
      <InputRightAddon {...propsKeyValue} />
    </Box>
  )
}

export default InputRightAddonPreview
