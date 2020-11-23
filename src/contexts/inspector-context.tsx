import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

// The background colour alone is made as default because it is the only prop present on both root and non-root elements.
// When the component changes, the background colour is left out, so it is not added to the array.
// That is the reason, why it had been added as the default prop.
const DEFAULT_ACTIVE_PROPS = ['backgroundColor']

type UpdateProps = {
  addActiveProps: (propsName: string) => void
  clearActiveProps: () => void
}

type InspectorProviderProps = { children: React.ReactNode }

const InspectorStateContext = createContext<string[]>([])
const InspectorUpdateContext = createContext<UpdateProps>({
  addActiveProps: () => {},
  clearActiveProps: () => {},
})

function InspectorProvider({ children }: InspectorProviderProps) {
  const [activeProps, setActiveProps] = useState<string[]>(DEFAULT_ACTIVE_PROPS)

  const addActiveProps = useCallback((propsName: string) => {
    setActiveProps(prevActiveProps => [...prevActiveProps, propsName])
  }, [])

  const clearActiveProps = useCallback(() => {
    setActiveProps(DEFAULT_ACTIVE_PROPS)
  }, [])

  const values = useMemo(() => {
    return { clearActiveProps, addActiveProps }
  }, [addActiveProps, clearActiveProps])

  return (
    <InspectorStateContext.Provider value={activeProps}>
      <InspectorUpdateContext.Provider value={values}>
        {children}
      </InspectorUpdateContext.Provider>
    </InspectorStateContext.Provider>
  )
}

function useInspectorState() {
  return useContext(InspectorStateContext)
}

function useInspectorUpdate() {
  return useContext(InspectorUpdateContext)
}

export { InspectorProvider, useInspectorState, useInspectorUpdate }
