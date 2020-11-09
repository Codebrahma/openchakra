import React from 'react'
import { Input } from '@chakra-ui/core'
import FormControl from '../../controls/FormControl'
import { useForm } from '../../../../hooks/useForm'
import usePropsSelector from '../../../../hooks/usePropsSelector'

const ImagePanel = () => {
  const { setValue } = useForm()

  const { propId: srcId, propValue: srcValue } = usePropsSelector('src')
  const {
    propId: fallbackSrcId,
    propValue: fallbackSrcValue,
  } = usePropsSelector('fallbackSrc')
  const { propId: altId, propValue: altValue } = usePropsSelector('alt')
  const { propId: htmlHeightId, propValue: htmlHeightValue } = usePropsSelector(
    'htmlHeight',
  )
  const { propId: htmlWidthId, propValue: htmlWidthValue } = usePropsSelector(
    'htmlWidth',
  )

  return (
    <>
      <FormControl label="Source" htmlFor="src">
        <Input
          placeholder="Image URL"
          value={srcValue || ''}
          size="sm"
          onChange={e => setValue(srcId, 'src', e.target.value)}
        />
      </FormControl>

      <FormControl label="Fallback Src" htmlFor="fallbackSrc">
        <Input
          placeholder="Image URL"
          value={fallbackSrcValue || ''}
          size="sm"
          onChange={e => setValue(fallbackSrcId, 'fallbackSrc', e.target.value)}
        />
      </FormControl>

      <FormControl label="Alt" htmlFor="alt">
        <Input
          value={altValue || ''}
          size="sm"
          onChange={e => setValue(altId, 'alt', e.target.value)}
        />
      </FormControl>

      <FormControl label="Html height" htmlFor="htmlHeight">
        <Input
          value={htmlHeightValue || ''}
          size="sm"
          onChange={e => setValue(htmlHeightId, 'htmlHeight', e.target.value)}
        />
      </FormControl>

      <FormControl label="Html width" htmlFor="htmlWidth">
        <Input
          value={htmlWidthValue || ''}
          size="sm"
          onChange={e => setValue(htmlWidthId, 'htmlWidth', e.target.value)}
        />
      </FormControl>
    </>
  )
}

export default ImagePanel
