import React from 'react'
import { useSelector } from 'react-redux'
import FormControl from '../controls/FormControl'
import { useForm } from '../../../hooks/useForm'
import {
  getSelectedComponent,
  getCustomComponents,
} from '../../../core/selectors/components'
import ColorsControl from '../controls/ColorsControl'
import { Input, Select } from '@chakra-ui/core'
import IconControl from '../controls/IconControl'
import SizeControl from '../controls/SizeControl'
import SwitchControl from '../controls/SwitchControl'
import VariantPanel from './styles/VariantPanel'

export type optionsType = {
  [name: string]: Array<string>
}
const propOptions: optionsType = {
  as: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
}

const ExposedPropsPanel: React.FC<{ propName: string }> = ({ propName }) => {
  const selectedComponent = useSelector(getSelectedComponent)
  const customComponents = useSelector(getCustomComponents)
  const exposedChild =
    customComponents[selectedComponent.exposedPropsChildren[propName][0]]
  let exposedPropName = propName
  exposedChild.exposedProps &&
    Object.values(exposedChild.exposedProps).forEach(exposedProp => {
      if (exposedProp.customPropName === propName)
        exposedPropName = exposedProp.targetedProp
    })

  const { setValueFromEvent } = useForm()

  const defaultControl = (
    <FormControl label={propName} htmlFor={propName}>
      <Input
        value={selectedComponent.props[propName]}
        size="sm"
        name={propName}
        onChange={setValueFromEvent}
      />
    </FormControl>
  )

  switch (exposedPropName) {
    case 'color':
      return (
        <ColorsControl name={propName} label={propName} enableHues={true} />
      )
    case 'variantColor':
      return <ColorsControl name={propName} label={propName} />
    case 'backgroundColor':
      return (
        <ColorsControl name={propName} label={propName} enableHues={true} />
      )
    case 'name': {
      if (exposedChild.type === 'Icon')
        return <IconControl label={propName} name={propName} />
      else return defaultControl
    }
    case 'icon':
      return <IconControl label={propName} name={propName} />
    case 'leftIcon':
      return <IconControl label={propName} name={propName} />
    case 'rightIcon':
      return <IconControl label={propName} name={propName} />
    case 'size': {
      if (exposedChild.type === 'Heading' || exposedChild.type === 'Avatar')
        return (
          <SizeControl
            name={propName}
            label={propName}
            value={selectedComponent.props[propName]}
            options={['xs', 'sm', 'md', 'lg', 'xl', '2xl']}
          />
        )
      return (
        <SizeControl
          name={propName}
          label={propName}
          value={selectedComponent.props[propName]}
        />
      )
    }
    case 'isChecked':
      return <SwitchControl label={propName} name={propName} />
    case 'showBorder':
      return <SwitchControl label={propName} name={propName} />
    case 'hasStripe':
      return <SwitchControl label={propName} name={propName} />
    case 'isInvalid':
      return <SwitchControl label={propName} name={propName} />
    case 'isReadOnly':
      return <SwitchControl label={propName} name={propName} />
    case 'isFullWith':
      return <SwitchControl label={propName} name={propName} />
    case 'isRound':
      return <SwitchControl label={propName} name={propName} />
    case 'isLoading':
      return <SwitchControl label={propName} name={propName} />
    case 'as':
      return (
        <FormControl label={propName}>
          <Select
            size="sm"
            value={propName || ''}
            onChange={setValueFromEvent}
            name={propName}
          >
            {propOptions[propName].map((propOption: string) => (
              <option>{propOption}</option>
            ))}
          </Select>
        </FormControl>
      )
    case 'variant':
      return (
        <VariantPanel
          label={propName}
          name={propName}
          value={selectedComponent.props[propName]}
          type={exposedChild.type}
        />
      )

    default:
      return defaultControl
  }
}
export default ExposedPropsPanel
