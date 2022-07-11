import { createGlobalStyle } from 'styled-components'
import { reboot } from 'styled-reboot'

const GlobalStyle = createGlobalStyle`
  ${reboot}
  /* latin-ext */
@font-face {
  font-family: 'Blinker';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Blinker Light'), local('Blinker-Light'), url(https://fonts.gstatic.com/s/blinker/v4/cIf4MaFatEE-VTaP_IWDdGgmnbJk.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Blinker';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: local('Blinker Light'), local('Blinker-Light'), url(https://fonts.gstatic.com/s/blinker/v4/cIf4MaFatEE-VTaP_IWDdGYmnQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* latin-ext */
@font-face {
  font-family: 'Blinker';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Blinker'), local('Blinker-Regular'), url(https://fonts.gstatic.com/s/blinker/v4/cIf9MaFatEE-VTaP9CChYVkH.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Blinker';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local('Blinker'), local('Blinker-Regular'), url(https://fonts.gstatic.com/s/blinker/v4/cIf9MaFatEE-VTaP9C6hYQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
  html, body, .viewport {
    width: 100%;
    height: 100%;
  }
  body{
    overflow: hidden;
    min-width:300px;
    overflow-x:auto;
    font-family: 'Blinker', cursive !important;    
    font-weight:100;
    color: #b3b2be;
    background-color: #2d2b37;
  }
  #root {
    height: 100%;
  }
  a {
    color: #b4ade1,
    decoration: none,
  }
  a:hover {
    color: #a198da,
    decoration: underline,
  }
`

export default GlobalStyle