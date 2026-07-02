import styled from 'styled-components'

export const Cell = styled.div`
display: ${({ $isHidden }) => $isHidden ? 'none' : 'auto'};
padding: 0.3rem;
position: relative;
height: 45px;
border-right: 1px solid ${({ theme }) => theme.background3};
border-bottom: 1px solid ${({ theme }) => theme.background3};
line-height: 1.1rem; 
font-size: 0.8rem;
color: ${({ theme }) => theme.fontColorDim};
`