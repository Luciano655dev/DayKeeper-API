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

    background-color: #EBECF0;

    .logoContainer {
        position: absolute;
        left: 1em;
    }

    .dayInfo {
        display: flex;
        flex-direction: row;
        max-width: 30em;
        flex-wrap: nowrap;
        overflow-x: scroll;

        &::-webkit-scrollbar {
            max-height: 2px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 1px;
        }

        h2 {
            margin: 0;
            white-space: nowrap;
        }

        h1 {
            margin: 0;
            white-space: nowrap;
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
                display: flex;
                align-items: center;
                border: 0;
                font-weight: 1000;

                padding: 0.5em;
                cursor: pointer;

                margin-right: 1em;

                border-radius: 0.5em;
                border: 1px solid gray;

                transition: 0.2s;

                svg {
                    font-size: 20px;
                    margin-right: 5px;
                }

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

export const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;

    width: 271px;
    height: 100%;
    padding-top: 16px;
    padding-right: 16px;
    padding-left: 16px;

    border-right: 1px solid gray;
`

export const SidebarArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    border-bottom: 1px solid gray;
    margin-bottom: 1em;
`

export const StyledSidebarLink = styled(Link)`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
    padding-right: 16px;

    align-items: center;

    width: 230px;
    height: 32px;

    border-radius: 8px;
    background: none;

    column-gap: 8px;

    text-decoration: none;
    color: black;

    &:hover {
        background-color: lightgray;
    }
    &:active {
        background-color: gray;
    }

    svg {
        font-size: 20px;
    }

    img {
        width: 2em;
        height: 2em;
        margin-right: 0.5em;
        border-radius: 10em;
    }
`