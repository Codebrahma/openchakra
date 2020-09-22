import React from 'react'
import {
  TooltipProps,
  IconButtonProps,
  Tooltip,
  IconButton,
} from '@chakra-ui/core'

interface Props
  extends Omit<TooltipProps, 'label' | 'aria-label' | 'children'> {
  icon: IconButtonProps['icon']
  as?: IconButtonProps['as']
  label: string
  isLoading?: boolean
  onClick?: IconButtonProps['onClick']
  colorScheme?: IconButtonProps['colorScheme']
  variant?: IconButtonProps['variant']
  size?: IconButtonProps['size']
  isDisabled?: boolean
}

const ActionButton: React.FC<Props> = ({
  icon,
  as,
  label,
  onClick,
  colorScheme,
  isLoading,
  variant,
  size = 'xs',
  isDisabled = false,
  ...props
}) => {
  return (
    <Tooltip hasArrow aria-label={label} label={label} zIndex={11}>
      <IconButton
        size={size}
        as={as}
        isLoading={isLoading}
        onClick={onClick}
        icon={icon}
        aria-label={label}
        colorScheme={colorScheme}
        variant={variant || 'ghost'}
        isDisabled={isDisabled}
        borderRadius="none"
        mr={0}
        _focus={{ shadow: 'none' }}
        {...props}
      />
    </Tooltip>
  )
}

export default ActionButton
