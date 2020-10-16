import React from 'react'
import SwitchControl from '../../controls/SwitchControl'
import TextControl from '../../controls/TextControl'
import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const StackPanel = () => {
  const alignItems = usePropsSelector('alignItems')
  const justifyContent = usePropsSelector('justifyContent')
  const direction = usePropsSelector('direction')

  return (
    <>
      <SwitchControl label="Inline" name="isInline" />
      <SwitchControl label="Wrap children" name="shouldWrapChildren" />
      <TextControl name="spacing" label="Spacing" />
      <FormControl label="Direction">
        <ComboBox
          value={direction || 'row'}
          name="flexDirection"
          options={['row', 'row-reverse', 'column', 'column-reverse']}
          editable={false}
        />
      </FormControl>

      <FormControl label="Justify content">
        <ComboBox
          value={justifyContent || 'flex-start'}
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
          value={alignItems || 'stretch'}
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
