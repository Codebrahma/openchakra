import React, { memo } from 'react'
import { Accordion } from '@chakra-ui/core'

import PaddingPanel from '../panels/styles/PaddingPanel'
import DimensionPanel from '../panels/styles/DimensionPanel'
import BorderPanel from '../panels/styles/BorderPanel'
import DisplayPanel from '../panels/styles/DisplayPanel'
import PositionPanel from '../panels/styles/PositionPanel'
import TypographyPanel from './styles/TypographyPanel'
import AccordionContainer from '../AccordionContainer'
import ColorsControl from '../controls/ColorsControl'
import EffectsPanel from './styles/EffectsPanel'
import ChildrenInspector from '../ChildrenInspector'
import ParentInspector from '../ParentInspector'
import AdditionalPropsPanel from './AdditionalPropsPanel'
import DownloadFontPanel from './DownloadFontPanel'
import LoadedFontsPanel from './LoadedFontsPanel'

interface Props {
  isRoot: boolean
  showChildren: boolean
  parentIsRoot: boolean
}

const StylesPanel: React.FC<Props> = ({
  isRoot,
  showChildren,
  parentIsRoot,
}) => {
  const defaultIndicesArray = []
  for (let i = 0; i < 14; i++) defaultIndicesArray.push(i)

  return (
    <Accordion defaultIndex={defaultIndicesArray} allowMultiple>
      {!isRoot && (
        <AccordionContainer title="Additional props">
          <AdditionalPropsPanel />
        </AccordionContainer>
      )}

      {!isRoot && (
        <AccordionContainer title="Parent">
          <ParentInspector />
        </AccordionContainer>
      )}

      {showChildren && (
        <AccordionContainer title="Children">
          <ChildrenInspector />
        </AccordionContainer>
      )}

      {!isRoot && (
        <>
          <AccordionContainer title="Layout">
            <DisplayPanel />
          </AccordionContainer>
          <AccordionContainer title="Position">
            <PositionPanel />
          </AccordionContainer>
          <AccordionContainer title="Spacing">
            <PaddingPanel type="margin" />
            <PaddingPanel type="padding" />
          </AccordionContainer>
          <AccordionContainer title="Size">
            <DimensionPanel />
          </AccordionContainer>
          <AccordionContainer title="Typography">
            <TypographyPanel />
          </AccordionContainer>
        </>
      )}

      <AccordionContainer title="Backgrounds">
        <ColorsControl
          withFullColor
          label="Color"
          name="backgroundColor"
          enableHues
        />
      </AccordionContainer>

      {!isRoot && (
        <>
          <AccordionContainer title="Border">
            <BorderPanel />
          </AccordionContainer>

          <AccordionContainer title="Effect">
            <EffectsPanel />
          </AccordionContainer>
        </>
      )}
      {isRoot && (
        <AccordionContainer title="Font Download">
          <DownloadFontPanel />
        </AccordionContainer>
      )}
      {isRoot && (
        <AccordionContainer title="Loaded Fonts">
          <LoadedFontsPanel />
        </AccordionContainer>
      )}
    </Accordion>
  )
}

export default memo(StylesPanel)
