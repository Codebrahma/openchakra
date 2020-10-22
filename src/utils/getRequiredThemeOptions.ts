const getRequiredThemeOptions = (propName: string, theme: any) => {
  switch (propName) {
    case 'width':
    case 'height': {
      return Object.keys(theme.sizes)
    }
    case 'padding':
    case 'margin': {
      return Object.keys(theme.space)
    }
    case 'zIndex': {
      return theme.zIndices
    }
    case 'fontSize': {
      return Object.keys(theme.fontSizes)
    }
    case 'lineHeight': {
      return Object.keys(theme.lineHeights)
    }
    case 'letterSpacing': {
      return Object.keys(theme.letterSpacings)
    }
    case 'shadow': {
      return Object.keys(theme.shadows)
    }
    case 'border': {
      return Object.keys(theme.borders)
    }
    case 'borderRadius': {
      return Object.keys(theme.radii)
    }
    default: {
      return []
    }
  }
}

export default getRequiredThemeOptions
