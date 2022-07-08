import { ThemeProvider } from "styled-components";
import GlobalStyle from './globalStyle'
import { defaultRebootTheme } from 'styled-reboot';

function App() {
  return (
    <ThemeProvider theme={defaultRebootTheme}>
      <GlobalStyle />
      <div className="App">
        hello world
      </div>
    </ThemeProvider>
  )
}

export default App
