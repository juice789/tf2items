import { themes } from './globalStyle'

const themeName = window.localStorage.getItem('theme')
export const theme = themes[Object.keys(themes).includes(themeName) ? themeName : 'dark']
