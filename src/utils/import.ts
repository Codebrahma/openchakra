import { fileOpen, fileSave } from 'browser-nativefs'
import { ComponentsState } from '../core/models/components/components'
import { INITIAL_STATE } from '../core/models/components/components-types'

type Workspace = {
  components: ComponentsState
  theme: any
  googleFonts: string[]
}

/**
 * @typedef {Object} Workspace
 * @property {ComponentsState} components - Components data
 * @property {any} theme - Theme object
 * @property {string[]} googleFonts - array containing names of google fonts
 */

/**
 * @method
 * @name loadFromJSON
 * @description This function is used to read the json file and load the workspace
 * @return   {Workspace}
 */
export async function loadFromJSON(): Promise<Workspace> {
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

  return { components: INITIAL_STATE, theme: {}, googleFonts: [] }
}

/**
 * @method
 * @name saveAsJSON
 * @description This function will save the workspace in the json file
 * @param {Workspace} payload workspace of the composer
 */
export async function saveAsJSON(payload: Workspace) {
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
