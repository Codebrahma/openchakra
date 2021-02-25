import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Spinner } from '@chakra-ui/core'

import formatCode from '../utils/formatCode'
import babelQueries from '../babel-queries/queries'

const ControlledEditor = lazy(() =>
  import('@monaco-editor/react').then((mod) => ({
    default: mod.ControlledEditor,
  })),
)

const generateProperCode = async (code: string) => {
  const codeWithOutComponentId = babelQueries.removeComponentId(code)

  // Remove the isContainerComponent prop if it is added for any custom component.
  const properCode = babelQueries.removePropInAllComponents(
    codeWithOutComponentId,
    {
      propName: 'isContainerComponent',
    },
  )

  return await formatCode(properCode)
}

const MonacoEditor = ({
  value,
  onChange,
}: {
  value: string
  onChange: (event: any, value: string | undefined) => void
}) => {
  const [code, setCode] = useState<string>(value)

  useEffect(() => {
    const getCode = async () => {
      const code = await generateProperCode(value)
      setCode(code)
    }

    getCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Suspense fallback={<Spinner />}>
      <ControlledEditor
        height="100%"
        language="javascript"
        theme="dark"
        options={{
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: 'hidden',
          },
        }}
        value={code}
        onChange={onChange}
      />
    </Suspense>
  )
}

export default MonacoEditor
