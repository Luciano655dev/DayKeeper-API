import styled from "styled-components"
import { Link } from 'react-router-dom'

export const StyledBody = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
`

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 50em;
    border-bottom: 1px solid black;
    margin: 1em;

    img{
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }
    button{
        background-color: red;
        color: white;
        border: none;
        border-radius: 1em;

        padding: 1em;
        margin: 1em;
        width: 100%;

        transition: 0.1s;

        &:hover {
            background-color: darkred;
            transform: translateY(3px);
        }
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