import WebFont from 'webfontloader'

const loadFonts = (fonts: Array<string>, onActive?: any, onInActive?: any) => {
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
