// fallback values for every theme key the item selector reads (same as the webclient's dark theme)
export const defaultTheme = {
    fontColorHighlight: '#ebeaec',
    fontColor: '#c3c1c5',
    fontColorDim: '#9b989f',
    fontColorDisabled: '#726e78',
    buttonTextColor: '#ffffff',
    background1: '#161319',
    background2: '#201d25',
    background3: '#2b2632',
    background4: '#36303e',
    mainColor: '#7d58bd',
    mainColorFade: '#ac95d5',
    successColor: '#239e10',
    errorColor: '#c6707b',
    errorColorFade: '#b64655'
}

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
