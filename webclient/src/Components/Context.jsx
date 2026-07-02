import { useState, createContext, useCallback } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { themes } from '../globalStyle'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children, theme: _theme }) => {
    const [theme, _saveTheme] = useState(_theme)
    const saveTheme = useCallback((newTheme) => {
        window.localStorage.setItem('theme', newTheme)
        _saveTheme(themes[newTheme])
    }, [])
    return <ThemeContext.Provider value={{ theme, saveTheme }}>
        <StyledThemeProvider theme={theme}>
            {children}
        </StyledThemeProvider>
    </ThemeContext.Provider>
}
