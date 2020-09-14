import { RootState } from '../store'

export const getSelectedTextDetails = (state: RootState) =>
  state.text.selectedTextDetails

export const getIsSelectionEnabled = (state: RootState) =>
  state.text.selectionEnabled

export const getIsContainsOnlySpan = (state: RootState) =>
  state.text.containsOnlySpan

export const getTextValue = (state: RootState) => state.text.textValue
