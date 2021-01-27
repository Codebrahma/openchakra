import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { Image, Box } from '@chakra-ui/core'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'
import { generatePropId } from '../../../utils/generateId'
import { getPropsBy } from '../../../core/selectors/components'
import { useSelector } from 'react-redux'

const ImagePreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    true,
  )
  const imageProps = useSelector(getPropsBy(component.id))
  const { drop, isOver } = useDropComponent(
    component.id,
    undefined,
    false,
    boundingPosition,
  )

  if (isOver)
    componentProps.push({
      id: generatePropId(),
      name: 'bg',
      value: 'teal.50',
      componentId: component.id,
      derivedFromPropName: null,
      derivedFromComponentType: null,
    })

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )
  const imagePropsKeyValue = findAndReplaceExposedPropValue(
    imageProps,
    customProps,
  )

  return (
    <Box
      {...propsKeyValue}
      height="fit-content"
      width="fit-content"
      ref={drop(ref)}
    >
      <Image {...imagePropsKeyValue} />
    </Box>
  )
}

export default ImagePreview
