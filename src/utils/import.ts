import { saveAs } from 'file-saver'
import generateZipFile from './generateZipFile/generateZipFile'

/**
 * @method
 * @name saveAsZip
 * @description This function will save the workspace as zip file
 * @param appCode code of the app
 * @param componentsCode code of the components
 */
export async function saveAsZip(payload: {
  appCode: string
  componentsCode: ICode
  fonts: Array<string>
  customTheme: any
}) {
  const generatedZip = generateZipFile({ ...payload })

  generatedZip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'workspace.zip')
  })
}
