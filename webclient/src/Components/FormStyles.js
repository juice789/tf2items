import styled from 'styled-components'

export const Form = styled.div`
display: flex;
flex-direction: column;
flex: 1 1 auto;
overflow-y: auto;
width: 50%;
color: #8a879a;
`

export const FormInner = styled.div`
display: flex;
flex-direction: column;
padding: 1rem 1rem 0.5rem 1rem;
`

export const FormRow = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 0.5rem;
height: 2rem;
font-size:0.9rem;
`

export const FormLabel = styled.label`
align-self: center;
width:50%;
margin: 0;
`

export const FormSelect = styled.div`
width:100%;
`

export const InputOuter = styled.div`
display:flex;
align-items:center;
justify-content:center;
width:50%;
`

export const FilterIcon = styled.div`
display:flex;
color:#6e66a6;
transition: transform 0.2s ease;
font-size:1rem;
`

export const FilterHeader = styled.div`
min-height:2.5rem;
display:flex;
align-items:center;
justify-content:space-between;
cursor:pointer;
`

export const FilterContent = styled.div`
display:flex;
flex-direction:column;
padding-top:0.5rem;
visibility:${({ hidden }) => hidden ? 'hidden' : 'visible'};
> ${FormRow} > ${FormLabel}{
    padding-left: 0.5rem;
}`

export const Filters = styled.div`
display: ${({ isDisabled }) => isDisabled ? 'none' : 'flex'};
flex-direction: column;
font-size: 0.9rem;
max-height: ${({ isOpen }) => isOpen ? '50rem' : '2.5rem'};
transition: max-height 0.2s ease;
border: 1px solid #403d4f;
padding: 0 0.5rem;
border-radius: 0.5rem;
flex: 0 0 auto;
overflow: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
margin-bottom:0.5rem;
box-sizing: content-box;
> ${FilterHeader} > ${FilterIcon}{
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
}
`

export const SaveOptions = styled.div`
border-top: 1px solid #403d4f;
padding: 1rem 1rem 0.5rem 1rem;
`

export const Save = styled.button`
display: flex;
justify-content: center;
height:2rem;
align-items:center;
padding: 0.2rem 1rem;
cursor: pointer;
background: #6e66a6;
color: #f9f9fa;
border-radius: 0.3rem;
transition: background 0.2s ease;
line-height:1rem;
border: 0;
font-weight:300;
font-size:0.9rem;
user-select:none;
:enabled: hover{
    background:#897fd0;
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

export const SaveMain = styled(Save)`
width: 100%;
`

export const FormInput = styled.input`
border: 1px solid #3a3747;
outline: none;
width: 100%;
background-color: #3a3747;
color: #f9f9fa;
height: 35px;
border-radius: 0.2rem;
padding-left: 0.6rem;
font-weight:300 !important;
:hover{
    border-color: #6e66a6;
}
`