import styled from 'styled-components'

export const Aside = styled.div`
display: flex;
flex-direction: column;
position: relative;
flex: 0 1 auto;
overflow-y: auto;
width: 25%;
min-width:25rem;
@media (max-width:850px){
    width:100%;
    min-width:20rem;
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

export const MenuBox = styled.div`
background: ${({ theme }) => theme.background1};
height: 2rem;
font-size: 0.9rem;
border-radius: 0.5rem;
display: flex;
align-items: center;
padding: 0 0.5rem;
justify-content: space-between;
border: 1px solid ${({ theme }) => theme.background1};
user-select: none;
color: ${({ theme }) => theme.fontColorDim};
position: relative;
gap: 0.5rem;
&:hover {
    border-color: ${({ theme }) => theme.mainColor};
    color: ${({ theme }) => theme.fontColor};
}
`

export const MenuDropdown = styled.div`
display: flex;
flex-direction: column;
background: ${({ theme }) => theme.background1};
position: absolute;
top: 2.25rem;
right: 0rem;
min-width: 100%;
border-radius: 0.5rem;
overflow: hidden;
z-index: 11;
border: 1px solid ${({ theme }) => theme.background1};
font-size: 0.8rem;
box-shadow: rgb(0 0 0 / 1%) 0px 0px 1px, rgb(0 0 0 / 10%) 0px 4px 8px, rgb(0 0 0 / 10%) 0px 16px 24px, rgb(0 0 0 / 1%) 0px 24px 32px;
`

export const MenuOption = styled.div`
height: 2.5rem;
min-width: 100%;
width: max-content;
display: flex;
align-items: center;
justify-content: space-between;
color: ${({ theme }) => theme.fontColor};
background: ${({ $isActive, theme }) => $isActive ? theme.mainColor : 'inherit'};
&:hover {
    background: ${({ theme }) => theme.mainColor};
}
`

export const MenuLabel = styled.div`
display: flex;
height: 100%;
min-width: 5rem;
align-items: center;
`

export const MenuIcon = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-weight: bold;
color: ${({ theme }) => theme.mainColor};
`
