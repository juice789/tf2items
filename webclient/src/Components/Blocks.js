import styled from 'styled-components'

export const Aside = styled.div`
display: flex;
flex-direction: column;
position: relative;
flex: 0 1 auto;
overflow-y: auto;
width: 25%;
min-width:25rem;
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
border-bottom: 1px solid #403d4f;
padding: 0 0.25rem 0 1rem;
flex: 0 0 auto;
align-items: center;
background: #33313f;
justify-content: space-between;
box-sizing:border-box;
font-size: 0.9rem;
color: #f9f9fa;
`

export const HeaderButton = styled.div`
width: 3rem;
height: 2rem;
margin: 0 0.25rem 0 0.25rem;
border-radius: 0.5rem;
background: ${({ active }) => active ? '#3a3747' : '#2d2b37'};
display: flex;
align-items: center;
justify-content: center;
color: #8a879a;
transition: color 0.2s ease;
cursor: pointer;
position: relative;
:hover {
    color: #e1e0e5;
}
`

export const SaveButton = styled.button`
display: flex;
justify-content: center;
height:2rem;
align-items:center;
padding: 0.2rem 1rem;
cursor: pointer;
background: ${({ danger }) => danger ? '#b74838' : '#6e66a6'};
color: #f9f9fa;
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height:1rem;
border: 0;
font-weight:300;
user-select:none;
width: ${({ full }) => full ? '100%' : 'auto'};
:enabled: hover{
    background: ${({ danger }) => danger ? '#762114' : '#897fd0'};
}
:disabled{
    cursor: not-allowed;
    background: rgba(138, 135, 154, 0.2);
    color:rgba(138, 135, 154, 0.5);
}
:active, :focus{
    outline:0;
    border: 0;
}
`

export const ChangeCounter = styled.div`
position: absolute;
background: #b74838;
height: 1rem;
width: 1rem; 
display: flex;
align-items: center;
justify-content: center;
top: calc(70% - 0.5rem);
left: calc(70% - 0.5rem);
border-radius: 1rem;
color: #e1e0e5;
font-size: 0.8rem;
`