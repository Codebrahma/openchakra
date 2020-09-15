import { createModel } from '@rematch/core'
import produce from 'immer'

type SelectedTextDetails = {
  startIndex: number
  endIndex: number
  startNodePosition: number
  endNodePosition: number
}

export type TextState = {
  selectedTextDetails: SelectedTextDetails
  containsOnlySpan: boolean
  selectionEnabled: boolean
  textValue: string
}

const text = createModel({
  state: {
    selectedTextDetails: {
      startIndex: -1,
      endIndex: -1,
      startNodePosition: -1,
      endNodePosition: -1,
    },
    containsOnlySpan: false,
    selectionEnabled: false,
    textValue: 'Text value',
  } as TextState,
  reducers: {
    setSelectionDetails: (state: TextState): TextState => {
      return produce(state, (draftState: TextState) => {
        const selection = window.getSelection() || document.getSelection()

        let startNodeIndex = 0
        let endNodeIndex = 0

        if (selection) {
          let startNode = selection.anchorNode
          let endNode = selection.focusNode
          draftState.selectedTextDetails.startIndex = selection.anchorOffset
          draftState.selectedTextDetails.endIndex = selection.focusOffset

          if (startNode && endNode) {
            if (
              startNode.parentNode?.nodeName === 'SPAN' &&
              endNode.parentNode?.nodeName === 'SPAN'
            )
              draftState.containsOnlySpan = true
            else draftState.containsOnlySpan = false

            if (startNode.parentNode?.nodeName === 'SPAN')
              startNode = startNode.parentNode
            const childNodesLength =
              startNode.parentNode?.childNodes.length || 0

            while ((startNode = startNode.nextSibling) != null) startNodeIndex++

            if (endNode.parentNode?.nodeName === 'SPAN')
              endNode = endNode.parentNode

            while ((endNode = endNode.nextSibling) != null) endNodeIndex++

            draftState.selectedTextDetails.startNodePosition =
              childNodesLength - startNodeIndex - 1
            draftState.selectedTextDetails.endNodePosition =
              childNodesLength - endNodeIndex - 1
            draftState.selectionEnabled = true
          }
        }
      })
    },
    removeSelection: (state: TextState): TextState => {
      if (!state.selectionEnabled) return state
      return {
        ...state,
        selectionEnabled: false,
      }
    },
    reset: (state: TextState): TextState => {
      return {
        ...state,
        selectedTextDetails: {
          startIndex: -1,
          endIndex: -1,
          startNodePosition: -1,
          endNodePosition: -1,
        },
        containsOnlySpan: false,
        selectionEnabled: false,
      }
    },
    setTextValue: (state: TextState, value: string) => {
      return {
        ...state,
        textValue: value,
      }
    },
  },
})

export default text
