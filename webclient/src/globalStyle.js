import { createGlobalStyle } from 'styled-components'
import { reboot } from 'styled-reboot'

const colors = {
    gray: [
        "#000000",
        "#050506",
        "#0b0a0c",
        "#100e13",
        "#161319",
        "#1b181f",
        "#201d25",
        "#26222b",
        "#2b2632",
        "#312b38",
        "#36303e",
        '#4a4551',
        '#5e5965',
        '#726e78',
        '#86838b',
        '#9b989f',
        '#afacb2',
        '#c3c1c5',
        '#d7d6d8',
        '#ebeaec',
        '#ffffff'
    ],
    violet: [
        '#faf9fd',
        '#f0ecf7',
        '#e5ddf2',
        '#d9ceec',
        '#ccbde5',
        '#bdaadd',
        '#ac95d5',
        '#987bca',
        '#7d58bd',
        '#4d1aa4'
    ],
    fuschia: [
        '#fcf8fc',
        '#f5eaf7',
        '#eedbf1',
        '#e6caea',
        '#ddb8e3',
        '#d3a3da',
        '#c78ad1',
        '#b96cc5',
        '#a441b4',
        '#6d0c7c'
    ],
    pink: [
        '#fcf8fb',
        '#f7eaf2',
        '#f1dbe9',
        '#eacade',
        '#e3b7d3',
        '#daa2c6',
        '#d08ab6',
        '#c46ba4',
        '#b34089',
        '#7a0c52'
    ],
    red: [
        '#fcf8f9',
        '#f7ebec',
        '#f1dcde',
        '#eacbcf',
        '#e3b9bf',
        '#dba5ac',
        '#d28d96',
        '#c6707b',
        '#b64655',
        '#810d1c'
    ],
    orange: [
        '#fcf9f7',
        '#f5ece6',
        '#eeded4',
        '#e6cec1',
        '#debdab',
        '#d4ab92',
        '#c99476',
        '#bb7a54',
        '#a85525',
        '#6a2e0b'
    ],
    yellow: [
        '#fafaf4',
        '#f1eedb',
        '#e7e2c2',
        '#dbd4a5',
        '#cfc586',
        '#c1b463',
        '#b0a139',
        '#9c8910',
        '#7b6c0c',
        '#483f07'
    ],
    lime: [
        '#f8faf3',
        '#e9f1db',
        '#d8e6c0',
        '#c6daa3',
        '#b2ce83',
        '#9bbf5e',
        '#80ae32',
        '#65970f',
        '#50770c',
        '#2f4607'
    ],
    green: [
        '#f5fbf5',
        '#e1f2df',
        '#cbe9c7',
        '#b3dead',
        '#98d38f',
        '#78c56d',
        '#52b443',
        '#239e10',
        '#1b7d0d',
        '#104a07'
    ],
    teal: [
        '#f5fbf7',
        '#dff2e6',
        '#c7e9d3',
        '#addebf',
        '#8fd2a8',
        '#6dc58d',
        '#43b46d',
        '#109e44',
        '#0c7d36',
        '#074a20'
    ],
    cyan: [
        '#f4fbfa',
        '#ddf2ef',
        '#c5e8e3',
        '#a9ddd6',
        '#8ad1c7',
        '#67c2b6',
        '#3bb1a2',
        '#0f9a88',
        '#0c7a6b',
        '#07483f'
    ],
    blue: [
        '#f7fafc',
        '#e5eff5',
        '#d2e3ed',
        '#bed7e5',
        '#a7c9dc',
        '#8eb9d2',
        '#70a7c6',
        '#4c90b8',
        '#1b72a5',
        '#0a4364'
    ],
    indigo: [
        '#f9f9fc',
        '#ebedf7',
        '#dde0f2',
        '#ced2eb',
        '#bdc2e5',
        '#aab1dd',
        '#949cd4',
        '#7a84ca',
        '#5865bc',
        '#1d2fa5'
    ]
}

export const themes = {}

const mobileBreakPoint = '850px'

themes.dark = {
    name: 'dark',
    mobileBreakPoint,
    fontColorHighlight: colors.gray[19],
    fontColor: colors.gray[17],
    fontColorDim: colors.gray[15],
    fontColorDisabled: colors.gray[13],
    buttonTextColor: colors.gray[20],
    background1: colors.gray[4],
    background2: colors.gray[6],
    background3: colors.gray[8],
    background4: colors.gray[10],
    mainColor: colors.violet[8],
    mainColorFade: colors.violet[6],
    successColor: colors.green[7],
    errorColor: colors.red[7],
    errorColorFade: colors.red[8],
    linkColor: colors.indigo[5],
    linkColorFade: colors.indigo[7]
}

themes.light = {
    name: 'light',
    mobileBreakPoint,
    fontColorHighlight: colors.gray[1],
    fontColor: colors.gray[4],
    fontColorDim: colors.gray[8],
    fontColorDisabled: colors.gray[12],
    buttonTextColor: colors.gray[20],
    background1: colors.gray[20],
    background2: colors.gray[19],
    background3: colors.gray[18],
    background4: colors.gray[17],
    mainColor: colors.violet[7],
    mainColorFade: colors.violet[6],
    successColor: colors.green[8],
    errorColor: colors.red[8],
    errorColorFade: colors.red[7],
    linkColor: colors.indigo[8],
    linkColorFade: colors.indigo[6]
}

const GlobalStyle = createGlobalStyle`
${reboot}
html, body, .viewport {
    width: 100%;
    height: 100%;
}
body{
    overflow: hidden;
    min-width:300px;
    overflow-x:auto;
    font-family: monospace;
    color: ${({ theme }) => theme.fontColor};
    background-color: ${({ theme }) => theme.background1};
}
#root {
    height: 100%;
}
a {
    color: ${({ theme }) => theme.linkColor},
    decoration: none,
}
a:hover {
    color: ${({ theme }) => theme.linkColorFade},
    decoration: underline,
}
.fast-option{
    color: ${({ theme }) => theme.fontColorHighlight};
    background: ${({ theme }) => theme.background3};
    cursor: default;
}
.fast-option:hover{
    background: ${({ theme }) => theme.mainColorFade};
}
.fast-option-selected{
    background: ${({ theme }) => theme.mainColorFade};
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
`

export default GlobalStyle

export const selectStyle = (theme, {
    background = theme.background3,
    menuBackground = theme.background3,
    primaryColor = theme.mainColor,
    borderColor = theme.mainColor,
    controlHeight = '35px',
    placeHolderColor = theme.fontColorDim,
    textColor = theme.fontColorHighlight,
    iconColor = theme.fontColorDim,
    singleStyles = {},
    optionStyles = {},
    containerStyles = {},
    menuStyles = {},
    valueContainerStyles = {},
    controlStyles = {}
} = {}) => ({
    container: (defaults) => ({
        ...defaults,
        ...containerStyles,
    }),
    control: (defaults, { isFocused }) => ({
        ...defaults,
        boxShadow: isFocused ? `0 0 0 1px ${borderColor}` : 'none',
        borderColor: isFocused ? borderColor : 'transparent',
        background,
        height: controlHeight,
        minHeight: controlHeight,
        ...controlStyles,
        ':hover': {
            ...defaults[':hover'],
            boxShadow: isFocused ? `0 0 0 1px ${borderColor}` : 'none',
            borderColor: borderColor
        }
    }),
    placeholder: (defaults) => ({
        ...defaults,
        color: placeHolderColor
    }),
    indicatorSeparator: () => ({
        display: 'none'
    }),
    singleValue: (defaults) => ({
        ...defaults,
        color: textColor,
        ...singleStyles
    }),
    dropdownIndicator: (defaults) => ({
        ...defaults,
        color: `${primaryColor} !important`,
        padding: '5px'
    }),
    menu: (defaults) => ({
        ...defaults,
        background: menuBackground,
        ...menuStyles
    }),
    valueContainer: (defaults) => ({
        ...defaults,
        ...valueContainerStyles
    }),
    option: (defaults, { isSelected }) => ({
        ...defaults,
        color: textColor,
        background: isSelected ? primaryColor : menuBackground,
        ':hover': {
            ...defaults[':hover'],
            background: primaryColor
        },
        ...optionStyles
    }),
    input: (defaults) => ({
        ...defaults,
        color: textColor
    }),
    indicatorsContainer: (defaults) => ({
        ...defaults,
        padding: 0,
        '> div': {
            padding: '0 !important',
            paddingRight: '5px !important',
            color: iconColor,
            ':hover': {
                color: textColor,
                cursor: 'default'
            },
        }
    })
})

export const selectStyleAlt = (theme) => ({
    background: theme.background1,
    controlHeight: '2rem',
    singleStyles: {
        maxWidth: 'unset',
        transform: 'unset',
        top: 'unset',
        position: 'relative'
    },
    controlStyles: {
        borderRadius: '0.5rem'
    },
    containerStyles: {
        fontSize: '0.8rem'
    }
})

export const toggleStyle = {
    trackContent: (defaults, { theme }) => ({
        ...defaults,
        '&:nth-child(2)': {
            color: theme.successColor
        },
        '&:nth-child(3)': {
            color: theme.errorColor
        },
        '>svg': {
            fontWeight: '600'
        }
    }),
    track: (defaults, { theme }) => ({
        ...defaults,
        background: theme.background3,
        border: `1px solid ${theme.background3}`,
        boxShadow: `0 0 0 1px ${theme.background3}`,
        '&:hover': {
            background: theme.background3,
            border: `1px solid ${theme.mainColor}`,
            boxShadow: `0 0 0 1px ${theme.background3}, 0 0 0 2px ${theme.mainColorFade}`
        }
    }),
    thumb: (defaults, { theme }) => ({
        ...defaults,
        background: theme.mainColor
    })
}
