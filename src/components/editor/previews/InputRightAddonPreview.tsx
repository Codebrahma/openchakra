import React from 'react'
import { Box, InputRightAddon } from '@chakra-ui/core'
import { useInteractive } from '../../../hooks/useInteractive'
import { useSelector } from 'react-redux'
import { getAllProps } from '../../../core/selectors/components'
import generatePropsKeyValue from '../../../utils/generatePropsKeyValue'

const InputRightAddonPreview: React.FC<{ component: IComponent }> = ({
  component,
}) => {
  const { props: componentProps, ref } = useInteractive(component)
  const boxProps: any = {}

  const props = useSelector(getAllProps)

  const propsKeyValue = generatePropsKeyValue(componentProps, props)

  return (
    <Box {...boxProps} ref={ref}>
      <InputRightAddon {...propsKeyValue} />
    </Box>
  )
}

export default InputRightAddonPreview
