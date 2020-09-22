import React, { memo, useState, useEffect } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Box, Button, useClipboard } from '@chakra-ui/core'
import { generateCode } from '../utils/codeGeneration/code'
import theme from 'prism-react-renderer/themes/nightOwlLight'
import { useSelector } from 'react-redux'
import {
  getComponents,
  getCustomComponents,
  getCustomComponentsList,
  getProps,
  getCustomComponentsProps,
} from '../core/selectors/components'
import { getCustomTheme } from '../core/selectors/app'

const CodePanel = () => {
  const components = useSelector(getComponents)
  const customComponents = useSelector(getCustomComponents)
  const customComponentsList = useSelector(getCustomComponentsList)
  const props = useSelector(getProps)
  const customComponentsProps = useSelector(getCustomComponentsProps)
  const [code, setCode] = useState<string | undefined>(undefined)
  const customTheme = useSelector(getCustomTheme)

  useEffect(() => {
    const getCode = async () => {
      const code = await generateCode(
        components,
        customComponents,
        customComponentsList,
        props,
        customComponentsProps,
        customTheme,
      )
      setCode(code)
    }

    getCode()
  }, [
    components,
    customComponents,
    customComponentsList,
    props,
    customComponentsProps,
    customTheme,
  ])

  const { onCopy, hasCopied } = useClipboard(code)

  return (
    <Box
      p={4}
      fontSize="sm"
      backgroundColor="rgb(251 251 251)"
      overflow="auto"
      height="100%"
      position="relative"
      maxWidth="83vw"
    >
      <Button
        onClick={onCopy}
        size="sm"
        position="absolute"
        textTransform="uppercase"
        fontSize="xs"
        height="30px"
        top={3}
        right="2.25em"
        zIndex={100}
        bg="#8888FC"
        color="white"
        _hover={{ bg: '#4D3DF7' }}
      >
        {hasCopied ? 'copied' : 'copy'}
      </Button>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code || '// Formatting code… please wait ✨'}
        language="jsx"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                <Box
                  display="inline-block"
                  width="2em"
                  userSelect="none"
                  opacity={0.3}
                >
                  {i + 1}
                </Box>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
  )
}

export default memo(CodePanel)
