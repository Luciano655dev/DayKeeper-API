import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledCommentSection = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: ${(props: any) => props.invalid ? 'red' : 'black'};
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

export const StyledGifPreview = styled.div`
  position: relative;
  overflow: hidden;
  width: 15em;
  height: calc(15em - 2px);

  margin-left: 1em;

  border: 1px solid black;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;

    background-color: white;
    border: 1px solid red;
    font-size: 1em;
    color: red;

    &:hover {
      background-color: darkgray;
    }

    &:active {
      background-color: gray;
    }
  }
`

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;

  padding: 10px;
  margin: 0.5em;
  min-width: 5em;

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

export const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  margin: 10px;
  border-bottom: 1px solid black;
  
  div {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  img {
    margin: 0;
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }

  label {
    margin: 0;
    margin-left: 10px;
    font-family: 'JetBrains Mono';
  }

  p{
    margin: 0;
    margin-left: 2em;
    padding: 10px;
  }

  Link{
    text-decoration: none;
    color: black;
    border-bottom: 1px solid white;
    transition: 0.3s;

    &:hover{
      border-bottom: 1px solid black;
    }
  }
`

export const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 1.5em;
  margin-left: 0.5em;
  cursor: pointer;
  transition: 0.3s;

  &:hover{
    text-decoration: underline;
  }
`

export const StyledGif = styled.img`
  min-width: 10em;
  min-height: 10em;
  max-width: 20em;
  padding-left: 2em;
  object-fit: cover;
`
export const StyledGifArea = styled.div`
  display: flex;
  flex-direction: row;
`
