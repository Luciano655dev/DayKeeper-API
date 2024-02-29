import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledBody = styled.div`
    z-index: -100;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 80vh;
`

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20%;
    height: 70%;
    border-radius: 1em;
`

export const StyledImage = styled.img`
    min-width: 20em;
    min-height: 20em;
    max-width: 20em;
    max-height: 20em;
    margin: 0;
    border-radius: 100%;
`

export const StyledUsername = styled.h1`
    margin: 0;
    padding: 0;
    font-size: 4em;
`

export const StyledEmail = styled.h2`
    font-family: 'JetBrains Mono';
    margin: 0;
    font-size: 1em;
`

export const StyledFollowLink = styled(Link)`
    text-decoration: none;
    color: black;
    margin: 10px;
    font-size: 3em;
    padding-left: 20px;
    padding-right: 20px;

    &:hover{
        text-decoration: underline;
    }
`

export const StyledSubContainer = styled.div`
    display: flex;
    flex-direction: row;

    h1 {
        margin: 10px;
        font-size: 3em;
        padding-left: 20px;
        padding-right: 20px;
    }
`

export const StyledEditProfileButton = styled(Link)`
    padding: 10px;
    border-radius: 10px;
    text-decoration: none;
    color: white;
    font: bold;
    background-color: green;
`