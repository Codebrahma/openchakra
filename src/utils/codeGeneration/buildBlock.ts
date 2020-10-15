import isBoolean from 'lodash/isBoolean'

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const iconPropsHandler = (payload: {
  componentType: string
  propName: string
  propValue: string
  oldValue: string
}) => {
  const { componentType, propName, propValue, oldValue } = payload
  if (componentType === 'Icon' && propName === 'as') {
    return `={${propValue}}`
  } else if (
    propName === 'icon' ||
    propName === 'leftIcon' ||
    propName === 'rightIcon'
  ) {
    return `={<${propValue} />}`
  }
  return oldValue
}

export const buildBlock = (
  children: string[],
  components: IComponents,
  props: IProp[],
) => {
  let content = ''

  children.forEach((key: string) => {
    let childComponent = components[key]
    if (!childComponent) {
      console.error(`invalid component ${key}`)
    } else {
      const componentName = capitalize(childComponent.type)
      let propsContent = ''

      props
        .filter(prop => prop.componentId === childComponent.id)
        .forEach((prop: IProp) => {
          const propsValue = prop.value
          const propName = prop.name
          if (propsValue || prop.derivedFromPropName) {
            let value = `=${
              isNaN(propsValue)
                ? "'" + propsValue + "'"
                : '{' + propsValue + '}'
            }`

            if (propName !== 'children') {
              if (prop.derivedFromPropName) {
                value = `={${prop.derivedFromPropName}}`
              } else {
                value = iconPropsHandler({
                  componentType: components[prop.componentId].type,
                  propName,
                  propValue: propsValue,
                  oldValue: value,
                })

                if (components[propsValue]) {
                  value = `={<Box>
                       ${buildBlock(
                         components[propsValue].children,
                         components,
                         props,
                       )} 
                    </Box>}`
                }
                if (
                  propsValue === true ||
                  propsValue === 'true' ||
                  propsValue === 'false' ||
                  isBoolean(propsValue)
                ) {
                  value = ``
                }
              }
              propsContent += `${propName}${value} `
            }
          }
        })
      const childrenProp = props.find(
        prop =>
          prop.componentId === childComponent.id && prop.name === 'children',
      )
      const children = childComponent.children

      //For components like text,badge
      if (childrenProp?.value && childrenProp?.derivedFromPropName === null) {
        //For span elements
        if (Array.isArray(childrenProp?.value)) {
          let childrenValue = ''
          childrenProp.value.forEach((child: string) => {
            if (components[child]) {
              childrenValue =
                childrenValue + buildBlock([child], components, props)
            } else {
              childrenValue = childrenValue + child
            }
          })

          content += `<${componentName} ${propsContent}>
            ${childrenValue}
            </${componentName}>`
        } else
          content += `<${componentName} ${propsContent}>${childrenProp.value}</${componentName}>`
      }
      //For components like Box, Flex if they have children
      else if (children.length) {
        content += `<${componentName} ${propsContent}>
        ${buildBlock(childComponent.children, components, props)}
        </${componentName}>`
      }

      //For components like Box,Flex if they have exposed children
      else if (childrenProp?.derivedFromPropName) {
        content += `<${componentName} ${propsContent}>{${childrenProp.derivedFromPropName}}</${componentName}>`
      }
      //For component like Box,Flex if they have no children
      else {
        content += `<${componentName} ${propsContent} />`
      }
    }
  })

  return content
}
