import JSZip from 'jszip'
import { packageFile, indexFile, htmlFile } from './projectCode'
import babelQueries from '../../babel-queries/queries'

const generateZipFile = (appCode: string, componentsCode: ICode) => {
  const zip = new JSZip()

  const publicFolder = zip.folder('public')
  publicFolder?.file('index.html', htmlFile)

  const srcFolder = zip.folder('src')

  const code = babelQueries.removeComponentId(appCode)
  srcFolder?.file('App.js', code)

  const componentsFolder = srcFolder?.folder('components')
  Object.keys(componentsCode).forEach(componentName => {
    const code = babelQueries.removeComponentId(componentsCode[componentName])
    componentsFolder?.file(`${componentName}.js`, code)
  })

  srcFolder?.file('index.js', indexFile)
  zip.file('package.json', packageFile)
  return zip
}

export default generateZipFile
