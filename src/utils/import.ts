import { fileOpen, fileSave } from 'browser-nativefs'
import { ComponentsState } from '../core/models/components/components'
import { INITIAL_COMPONENTS } from '../core/models/components/components-types'

export async function loadFromJSON() {
  const blob = await fileOpen({
    extensions: ['json'],
    mimeTypes: ['application/json'],
  })

  const contents: string = await new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsText(blob, 'utf8')
    reader.onloadend = () => {
      if (reader.readyState === FileReader.DONE) {
        resolve(reader.result as string)
      }
    }
  })

  try {
    const workspace = JSON.parse(contents)
    return {
      components: workspace.components,
      theme: workspace.theme,
      googleFonts: workspace.googleFonts,
    }
  } catch (error) {}

  return { components: INITIAL_COMPONENTS, theme: {}, googleFonts: [] }
}

export async function saveAsJSON(payload: {
  components: ComponentsState
  theme: any
  googleFonts: string[]
}) {
  const { components, theme, googleFonts } = payload
  const serialized = JSON.stringify({ components, theme, googleFonts })
  const name = `workspace.json`

  await fileSave(
    new Blob([serialized], { type: 'application/json' }),
    {
      fileName: name,
      description: 'Composer file',
    },
    (window as any).handle,
  )
}
