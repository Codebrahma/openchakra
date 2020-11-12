import WebFont from 'webfontloader'

/**
 * @method
 * @name loadFonts
 * @description This function will load the mentioned google fonts using webFont
 * @param {Array<string>} fonts Array of google fonts
 * @param {Function} onActive callback to execute when the fonts are loaded
 * @param {Function} onInActive callback to execute when the fonts failed to load
 */

const loadFonts = (
  fonts: Array<string>,
  onActive?: () => void,
  onInActive?: () => void,
) => {
  WebFont.load({
    google: {
      families: fonts,
    },
    inactive: () => {
      onInActive && onInActive()
    },
    active: () => {
      onActive && onActive()
    },
    timeout: 2000,
  })
}

export default loadFonts
