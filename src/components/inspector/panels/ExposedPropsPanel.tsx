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

//find control by searching along the exposed children of custom component.
const findControl = (
  component: IComponent,
  customComponents: IComponents,
  propName: string,
) => {
  let controlProp: string = propName
  let controlComponent: IComponent = component
  const findControlRecursive = (comp: IComponent, propName: string) => {
    if (comp.exposedChildren && comp.exposedChildren[propName]) {
      const exposedChild = comp.exposedChildren[propName][0]
      const exposedProps = customComponents[exposedChild].exposedProps
      exposedProps &&
        Object.values(exposedProps).forEach(exposedProp => {
          if (exposedProp.customPropName === propName)
            controlProp = exposedProp.targetedProp
        })
      findControlRecursive(customComponents[exposedChild], controlProp)
    } else {
      controlProp = propName
      controlComponent = comp
    }
  }
  findControlRecursive(component, propName)
  return { controlProp: controlProp, controlComponent: controlComponent }
}

const ExposedPropsPanel: React.FC<{ propName: string }> = ({ propName }) => {
  const selectedComponent = useSelector(getSelectedComponent)
  const customComponents = useSelector(getCustomComponents)
  const { setValueFromEvent } = useForm()
  const { controlComponent, controlProp } = findControl(
    selectedComponent,
    customComponents,
    propName,
  )

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

  switch (controlProp) {
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
      if (controlComponent.type === 'Icon')
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
      if (
        controlComponent.type === 'Heading' ||
        controlComponent.type === 'Avatar'
      )
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
          type={controlComponent.type}
        />
      )

    default:
      return defaultControl
  }
}
export default ExposedPropsPanel
