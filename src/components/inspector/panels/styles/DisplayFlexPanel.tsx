import React, { memo } from 'react'

import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const DisplayFlexPanel = () => {
  const alignItems = usePropsSelector('alignItems')
  const flexDirection = usePropsSelector('flexDirection')
  const justifyContent = usePropsSelector('justifyContent')

  return (
    <>
      <FormControl label="Direction">
        <ComboBox
          value={flexDirection || 'row'}
          name="flexDirection"
          options={['row', 'row-reverse', 'column', 'column-reverse']}
          enableAutoComplete
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
          enableAutoComplete
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
          enableAutoComplete
        />
      </FormControl>
    </>
  )
}

export default memo(DisplayFlexPanel)
