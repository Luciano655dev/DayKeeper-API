import styled from "styled-components"
import { Link } from 'react-router-dom'

export const StyledBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 90vh;
`

export const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 50vw;
    height: 70vh;
`

export const StyledItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: auto;
    border-bottom: 1px solid black;
    margin: 1em;
    width: 100%;

    label{
        margin: 0;
        margin-top: 10px;
        margin-left: 10px;
        font-size: 1em;
    }
    h1{
        margin: 0;
        margin-left: 10px;
        font-size: 3em;
    }
    img{
        max-width: 100px;
        max-height: 100px;
        border-radius: 100%;
    }
`

export const StyledSearchBox = styled.div`
    position: absolute;
    top: 4vw;
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
    top: 5vw;
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
