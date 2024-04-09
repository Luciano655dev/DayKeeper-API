import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

export const StyledPostsLink = styled(Link)`
    text-decoration: none;
    color: black;
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;

    &:hover{
        text-decoration: underline;
    }
`

export const StyledSubContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        margin: 10px;
        font-size: 3em;
        padding-left: 20px;
        padding-right: 20px;
    }

    h2 {
        font-size: 0.5em;
    }

    div {
        display: flex;
        flex-direction: row;
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

export const StyledReportButton = styled.button `
    cursor: pointer;
    background: none;
    border: none;
    color: red;
    padding: 1em;

    &:hover{
        text-decoration: underline;
    }
`