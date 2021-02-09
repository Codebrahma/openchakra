import React from 'react'
import { useInteractive } from '../../../hooks/useInteractive'
import { useDropComponent } from '../../../hooks/useDropComponent'
import { Image } from '@chakra-ui/core'
import findAndReplaceExposedPropValue from '../../../utils/findAndReplaceExposedPropValue'

const ImagePreview: React.FC<{
  component: IComponent
  customProps: any
}> = ({ component, customProps }) => {
  const { props: componentProps, ref, boundingPosition } = useInteractive(
    component,
    false,
  )
  const { drop } = useDropComponent(
    component.id,
    undefined,
    false,
    boundingPosition,
  )

  const propsKeyValue = findAndReplaceExposedPropValue(
    componentProps,
    customProps,
  )

  return (
    <Image
      {...propsKeyValue}
      src={propsKeyValue?.src || 'alt'}
      ref={drop(ref)}
    />
  )
}

export default ImagePreview
