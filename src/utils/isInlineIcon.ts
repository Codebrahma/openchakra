export const isInlineIconString = (componentName: string, propName: string) => {
  return componentName === 'Icon' && propName === 'as'
}

export const isInlineIconComponent = (prop: string) => {
  return ['leftIcon', 'icon', 'rightIcon'].includes(prop)
}
