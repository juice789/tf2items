import styled from 'styled-components'

export const Cell = styled.div`
display: ${({ isHidden }) => isHidden ? 'none' : 'auto'};
padding: 0.3rem;
position: relative;
height: 35px;
border-right: 1px solid #3a3747;
border-bottom: 1px solid #3a3747;
line-height: 1.1rem; 
font-size: 0.8rem;
color: #8a879a;
`