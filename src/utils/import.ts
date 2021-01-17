import { saveAs } from 'file-saver'
import generateZipFile from './generateZipFile/generateZipFile'

/**
 * @method
 * @name saveAsZip
 * @description This function will save the workspace as zip file
 * @param appCode code of the app
 * @param componentsCode code of the components
 */
export async function saveAsZip(appCode: string, componentsCode: ICode) {
  const generatedZip = generateZipFile(appCode, componentsCode)

  generatedZip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'workspace.zip')
  })
}
