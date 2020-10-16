import React from 'react'
import { useSelector } from 'react-redux'
import FormControl from './FormControl'
import { useForm } from '../../../hooks/useForm'
import {
  getSelectedComponent,
  getCustomComponents,
  getPropsBy,
  getCustomComponentsProps,
  checkIsKeyForComponent,
} from '../../../core/selectors/components'
import ColorsControl from './ColorsControl'
import { Input, Select, Text } from '@chakra-ui/core'
import IconControl from './IconControl'
import SizeControl from './SizeControl'
import SwitchControl from './SwitchControl'
import VariantPanel from '../panels/styles/VariantPanel'
import SliderControl from './SliderControl'
import { findControl } from '../../../utils/recursive'

export type optionsType = {
  [name: string]: Array<string>
}
const propOptions: optionsType = {
  as: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
}

const CustomComponentsPropControl: React.FC<{ propName: string }> = ({
  propName,
}) => {
  const selectedComponent = useSelector(getSelectedComponent)
  const { setValueFromEvent } = useForm()

  //Why both the instance of custom component and also the original custom component.
  //Because derivedFromComponentType only points to original custom component.
  //instance of custom component is used to get value for the prop.
  const selectedProp = useSelector(getPropsBy(selectedComponent.id)).find(
    prop => prop.name === propName,
  )
  const selectedCustomComponentProp = useSelector(
    getPropsBy(selectedComponent.type),
  ).find(prop => prop.name === propName)

  const props = useSelector(getCustomComponentsProps)
  const customComponents = useSelector(getCustomComponents)

  const isKeyForComponent = useSelector(checkIsKeyForComponent(selectedProp))

  if (selectedProp && selectedCustomComponentProp) {
    const controlProp = findControl(
      selectedCustomComponentProp,
      props,
      customComponents,
    )

    //Find the type of the control component.
    const controlPropComponentType = customComponents[
      controlProp?.componentId || 'root'
    ]
      ? customComponents[controlProp?.componentId || 'root'].type
      : 'root'

    const defaultControl = (
      <FormControl label={propName} htmlFor={propName}>
        {!isKeyForComponent ? (
          <Input
            value={selectedProp?.value}
            size="sm"
            name={propName}
            onChange={setValueFromEvent}
          />
        ) : (
          <Text fontSize="10px" color="blackAlpha.700">
            Component as prop
          </Text>
        )}
      </FormControl>
    )
    switch (controlProp?.name) {
      case 'color':
        if (
          ['Switch', 'Progress', 'CircularProgress'].indexOf(
            controlPropComponentType,
          ) !== -1
        ) {
          return <ColorsControl name={propName} label={propName} />
        }
        return (
          <ColorsControl name={propName} label={propName} enableHues={true} />
        )
      case 'colorScheme':
        return <ColorsControl name={propName} label={propName} />
      case 'backgroundColor':
        return (
          <ColorsControl name={propName} label={propName} enableHues={true} />
        )
      case 'name': {
        if (controlPropComponentType === 'Icon')
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
          controlPropComponentType === 'Heading' ||
          controlPropComponentType === 'Avatar'
        )
          return (
            <SizeControl
              value={selectedProp?.value}
              options={['xs', 'sm', 'md', 'lg', 'xl', '2xl']}
            />
          )
        return (
          <SizeControl
            value={selectedProp?.value}
            options={['xs', 'sm', 'md', 'lg']}
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
      case 'isIndeterminate':
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
            value={selectedProp?.value}
            type={controlPropComponentType}
          />
        )
      case 'value':
        return <SliderControl label={propName} htmlFor={propName} />
      case 'thickness':
        return (
          <SliderControl
            label={propName}
            htmlFor={propName}
            min={0.1}
            max={1}
            step={0.1}
          />
        )
      case 'spacing':
        return (
          <SliderControl
            label={propName}
            htmlFor={propName}
            min={-3}
            max={6}
            step={1}
          />
        )

      default:
        return defaultControl
    }
  } else return null
}
export default CustomComponentsPropControl
