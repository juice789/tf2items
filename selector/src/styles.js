import styled from 'styled-components'

// no fixed width - the caller decides how the selector is contained
// the nested rules replace what the webclient got from the global reboot, so the selector works standalone
export const Aside = styled.div`
display: flex;
flex-direction: column;
position: relative;
flex: 1 1 auto;
height: 100%;
min-height: 0;
overflow-y: auto;
background: ${({ theme }) => theme.background1};
color: ${({ theme }) => theme.fontColor};
*, *::before, *::after {
    box-sizing: border-box;
}
[hidden] {
    display: none !important;
}
button, input {
    font-family: inherit;
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

export const AsideInner = styled.div`
display:flex;
position: relative;
flex: 0 1 auto;
overflow-y: auto;
flex-direction:column;
height:100%;
`

export const Header = styled.div`
height:3rem;
display: flex;
border-bottom: 1px solid ${({ theme }) => theme.background4};
padding: 0 0.25rem 0 1rem;
flex: 0 0 auto;
align-items: center;
background: ${({ theme }) => theme.background2};
justify-content: space-between;
box-sizing:border-box;
font-size: 0.9rem;
color: ${({ theme }) => theme.fontColorHighlight};
`

export const HeaderButton = styled.div`
width: 3rem;
height: 2rem;
margin: 0 0.25rem 0 0.25rem;
border-radius: 0.5rem;
background: ${({ $active, theme }) => $active ? theme.background3 : theme.background1};
display: flex;
align-items: center;
justify-content: center;
color: ${({ theme }) => theme.fontColorDim};
transition: color 0.2s ease;
cursor: pointer;
position: relative;
&:hover {
    color: ${({ theme }) => theme.fontColor};
}
`

export const SaveButton = styled.button`
display: flex;
justify-content: center;
height:2rem;
align-items:center;
padding: 0.2rem 1rem;
cursor: pointer;
background: ${({ $danger, theme }) => $danger ? theme.errorColor : theme.mainColor};
color: ${({ theme }) => theme.buttonTextColor};
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height:1rem;
border: 0;
font-weight:300;
user-select:none;
width: ${({ $full }) => $full ? '100%' : 'auto'};
&:enabled:hover{
    background: ${({ $danger, theme }) => $danger ? theme.errorColorFade : theme.mainColorFade};
}
&:disabled{
    cursor: not-allowed;
    background: ${({ theme }) => theme.background3};
    color: ${({ theme }) => theme.fontColorDisabled};
}
&:active, &:focus{
    outline:0;
    border: 0;
}
`

export const ChangeCounter = styled.div`
position: absolute;
background: ${({ theme }) => theme.errorColor};
height: 1rem;
padding: 0 0.2rem;
display: flex;
align-items: center;
justify-content: center;
top: calc(70% - 0.5rem);
right: 0;
border-radius: 0.5rem;
color: ${({ theme }) => theme.buttonTextColor};
font-size: 0.7rem;
`
