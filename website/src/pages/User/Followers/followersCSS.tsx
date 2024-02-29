import styled from "styled-components"
import { Link } from 'react-router-dom'

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    border-bottom: 1px solid black;
    margin: 1em;

    img{
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }
    button{
        padding: 10px;
        width: 5vw;
    }
`

export const StyledLink = styled(Link)`
    font-size: 2em;
    color: black;
    text-decoration: none;

    &:hover{
        text-decoration: underline;
    }
`