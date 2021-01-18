import JSZip from 'jszip'
import { packageFile, generateIndexFile, generateHTMLFile } from './projectCode'
import babelQueries from '../../babel-queries/queries'

const generateZipFile = (payload: {
  appCode: string
  componentsCode: ICode
  fonts: Array<string>
  customTheme: any
}) => {
  const zip = new JSZip()
  const { appCode, componentsCode, fonts, customTheme } = payload

  const publicFolder = zip.folder('public')

  const htmlFile = generateHTMLFile(fonts)
  publicFolder?.file('index.html', htmlFile)

  const srcFolder = zip.folder('src')

  const code = babelQueries.removeComponentId(appCode)
  srcFolder?.file('App.js', code)

  const componentsFolder = srcFolder?.folder('components')
  Object.keys(componentsCode).forEach(componentName => {
    const code = babelQueries.removeComponentId(componentsCode[componentName])
    componentsFolder?.file(`${componentName}.js`, code)
  })

  const indexFile = generateIndexFile(customTheme)
  srcFolder?.file('index.js', indexFile)
  zip.file('package.json', packageFile)
  return zip
}

export default generateZipFile
