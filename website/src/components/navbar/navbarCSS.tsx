import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'

export const GlobalStyle = createGlobalStyle`
    * {
        @import url('../../font.css');
        font-family: "Montserrat", sans-serif;
        font-style: normal;
    }
`

export const Container = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;

    max-width: 100vw;
    height: 7vh;
    padding-right: 1em;
    padding-left: 1em;

    border-bottom: 1px solid lightgray;

    background-color: #EBECF0;

    .logoContainer {
        position: absolute;
        left: 1em;
    }

    .dayInfo {
        display: flex;
        flex-direction: row;
        max-width: 30em;

        h2 {
            white-space: nowrap;
            overflow-x: hidden;
        }
    }

    .userDiv {
        position: absolute;
        right: 1em;
        .user {
            display: flex;
            flex-direction: row;
            align-items: center;

            button {
                border: 0;
                font-weight: 1000;

                padding: 0.5em;
                cursor: pointer;

                margin-right: 1em;

                border-radius: 0.5em;
                border: 1px solid gray;

                transition: 0.2s;

                &:hover {
                    border-radius: 1em;
                }
            }
        }
    }
`

export const Logo = styled(Link)`
    font-size: 40px;
    font: bold;
    color: black;
    text-decoration: none;
`

export const StyledLink = styled(Link)`
    margin: 0;
    font-size: 1.5em;

    color: black;
    text-decoration: none;

    border-bottom: 1px solid white;
    transition: 0.2s;

    &:hover{
        cursor: pointer;
        border-bottom: 1px solid black;
    }
`

export const StyledImage = styled.img`
    margin: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
`