import React from 'react'
import { IconButtonProps, Tooltip, IconButton } from '@chakra-ui/core'

interface ActionButtonProps {
  icon: IconButtonProps['icon']
  label: string
  isLoading?: boolean
  onClick?: IconButtonProps['onClick']
  colorScheme?: IconButtonProps['colorScheme']
  variant?: IconButtonProps['variant']
  size?: IconButtonProps['size']
  isDisabled?: boolean
  color?: IconButtonProps['color']
  bg?: IconButtonProps['bg']
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
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
