import { fileOpen, fileSave } from 'browser-nativefs'
import { INITIAL_COMPONENTS, ComponentsState } from '../core/models/components'

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
    return { components: workspace.components, theme: workspace.theme }
  } catch (error) {}

  return { components: INITIAL_COMPONENTS, theme: {} }
}

export async function saveAsJSON(components: ComponentsState, theme: any) {
  const serialized = JSON.stringify({ components, theme })
  const name = `workspace.json`

  await fileSave(
    new Blob([serialized], { type: 'application/json' }),
    {
      fileName: name,
      description: 'OpenChakra file',
    },
    (window as any).handle,
  )
}
