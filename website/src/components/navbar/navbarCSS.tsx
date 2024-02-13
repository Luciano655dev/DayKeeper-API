import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Container = styled.nav`
    position: sticky;
    width: 100vw;
    height: 7vh;

    display: flex;
    align-items: center;

    border-bottom: 1px solid lightgray;

    background-color: white;
`

export const Logo = styled(Link)`
    position: absolute;
    margin: 0;
    margin-left: 0.7em;
    font-size: 40px;
    font: bold;
    color: black;
    text-decoration: none;
`

export const List = styled.ul`
    position: absolute;
    right: 0;
    display: flex;
    list-style: none;
    align-items: center;

    li{
        margin-right: 2em;
    };
`

export const StyledLink = styled(Link)`
    margin: 0;
    padding-top: 10px;
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
    border-radius: 100px;
    cursor: pointer;
`