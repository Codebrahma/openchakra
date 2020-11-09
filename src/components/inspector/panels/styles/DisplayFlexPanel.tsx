import React, { memo } from 'react'

import FormControl from '../../controls/FormControl'
import usePropsSelector from '../../../../hooks/usePropsSelector'
import ComboBox from '../../inputs/ComboBox'

const DisplayFlexPanel = () => {
  const { propId: alignItemsId, propValue: alignItemsValue } = usePropsSelector(
    'alignItems',
  )
  const {
    propId: flexDirectionId,
    propValue: flexDirectionValue,
  } = usePropsSelector('flexDirection')
  const {
    propId: justifyContentId,
    propValue: justifyContentValue,
  } = usePropsSelector('justifyContent')

  return (
    <>
      <FormControl label="Direction">
        <ComboBox
          id={flexDirectionId}
          value={flexDirectionValue || 'row'}
          name="flexDirection"
          options={['row', 'row-reverse', 'column', 'column-reverse']}
          enableAutoComplete
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
          enableAutoComplete
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
          enableAutoComplete
        />
      </FormControl>
    </>
  )
}

export default memo(DisplayFlexPanel)
