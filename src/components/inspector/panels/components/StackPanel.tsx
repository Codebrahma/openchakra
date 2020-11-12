import React from 'react'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const StackPanel = () => {
  const { propId: alignItemsId, propValue: alignItemsValue } = usePropsSelector(
    'alignItems',
  )
  const {
    propId: justifyContentId,
    propValue: justifyContentValue,
  } = usePropsSelector('justifyContent')
  const { propId: directionId, propValue: directionValue } = usePropsSelector(
    'direction',
  )

  return (
    <>
      <SwitchControl label="Inline" name="isInline" />
      <SwitchControl label="Wrap children" name="shouldWrapChildren" />
      <TextControl name="spacing" label="Spacing" />
      <FormControl label="Direction">
        <ComboBox
          id={directionId}
          value={directionValue || 'row'}
          name="flexDirection"
          options={['row', 'row-reverse', 'column', 'column-reverse']}
          editable={false}
        />
      </FormControl>

      <FormControl label="Justify content">
        <ComboBox
          id={justifyContentId}
          value={justifyContentValue || 'flex-start'}
          name="justifyContent"
          options={[
            'flex-start',
            'center',
            'flex-end',
            'space-between',
            'space-around',
          ]}
          editable={false}
        />
      </FormControl>

      <FormControl label="Align items">
        <ComboBox
          id={alignItemsId}
          value={alignItemsValue || 'stretch'}
          name="alignItems"
          options={[
            'stretch',
            'flex-start',
            'center',
            'flex-end',
            'space-between',
            'space-around',
          ]}
          editable={false}
        />
      </FormControl>
    </>
  )
}

export default StackPanel
