import styled from "styled-components"
import { Link } from 'react-router-dom'

export const StyledBody = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 50vw;
`

export const StyledItem = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    border-bottom: 1px solid black;
    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
    margin: 1em;
    padding: 1em;

    max-height: 40vh;

    cursor: pointer;
    transition: 0.2s;

    &:hover {
        background-color: #888;
    }

    .upperContainer {
        display: flex;
        flex-direction: row;
        width: 100%;

        img{
            width: 3em;
            height: 3em;
            border-radius: 100%;
        }

        h1{
            margin: 0;
            margin-top: 5px;
            margin-left: 10px;
            font-size: 2em;
        }
    }

    .filesContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-y: hidden;

        img {
            margin: 1em;
            max-width: 60%;
            height: 90%;
            object-fit: fill;
        }

        video {
            margin: 1em;
            max-width: 60%;
            height: 90%;
            object-fit: fill;
        }

        &::-webkit-scrollbar {
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: gray;
            border-radius: 5px;
        }
    }

    .bottomContainer{
        display: flex;
        justify-content: space-between;

        width: 100%;
        margin-top: 1em;

        .reactionsContainer {
            display: flex;

            div {
                margin-left: 0.5em;
            }
        }
    }
`

export const StyledLink = styled(Link)`
    padding: 0.5em;
    font-size: 1em;
    border-radius: 10px;
    margin: 10px;
    background-color: #4caf50;
    text-decoration: none;
    color: white;
`

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
  opacity: ${(props: any) => !props.enabled ? 0.5 : 1};
`

export const StyledInput = styled.input`
    width: 50vw;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`

export const StyledSelectContainer = styled.div`
    display: flex;
    flex-direction: row;

    select {
        padding: 10px;
        margin-left: 0.5em;
        margin-right: 0.5em;
        border: none;
        border-bottom: 1px solid #4caf50;
        border-radius: 5px;
    }

    option {
        border-bottom: 1px solid #4caf50;
        border-radius: 5px;
    }

    input {
        width: 6em;

        border: none;
        border-bottom: 1px solid black;
        border-radius: 0.5em;

        padding: 0.5em;
        font-size: 1em;
    }
`
