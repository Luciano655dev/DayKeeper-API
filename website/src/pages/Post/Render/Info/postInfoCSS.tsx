import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"

export const StyledImage = styled.img`
  max-width: 100px;
  max-height: 100px;
`

export const StyledCommentSection = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 2em;
  margin-left: 0.5em;
  cursor: pointer;
  transition: 0.3s;

  &:hover{
    text-decoration: underline;
  }
`

export const StyledReactions = styled.div`
  label {
    margin: 0;
    margin-left: 10px;
    font-family: 'JetBrains Mono';
  }
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
`

export const StyledGif = styled.img`
  min-width: 10em;
  min-height: 10em;
  max-width: 20em;
  padding-left: 2em;
  object-fit: cover;
`

export const StyledForm = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 5px;
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

export const StyledCheckbox = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

export const StyledUserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 1em;

  img{
    width: 4em;
    height: 4em;
    border-radius: 100%;
  }
  h1{
    font-size: 2em;
    margin-left: 0.5em;
  }
`

export const StyledGifArea = styled.div`
  display: flex;
  flex-direction: row;
`

export const StyledGifContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;

  width: 20em;
  height: 15em;

  background-color: black;

  overflow-y: scroll;

  img{
    margin: 1em;
    max-width: 7em;
    max-height: 7em;
    min-width: 3em;
    min-height: 3em;
  }
`

export const StyledGifSearchContainer = styled.div`
  display: flex;
  flex-direction: row;

  position: sticky;
  top: 0;
  z-index: 2;

  input{
    width: 15em;
    height: 1em;

    padding: 0.5em;
    text-align: center;
  }

  button {
    width: 5em;
    height: 2.3em;

    padding: 0.5em;
    text-align: center;
  }
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

// ALERT
const fadeOutAnimation = keyframes`
  0%{
    opacity: 100%;
    right: -10vw;
  }
  10%{
    right: 3vw;
  }
  80%{
    opacity: 100%;
  }
  100%{
    opacity: 0%;
    display: none;
  }
`

// Componente StyledAlert
export const StyledAlert: any = styled.div`
  position: absolute;
  right: 1vw;
  padding: 10px;
  background-color: green;
  color: white;
  margin-top: 10px;
  border-radius: 5px;
  animation: ${fadeOutAnimation} 2s ease forwards; // Aplica a animação de fade-out com duração de 2 segundos
  opacity: ${({ visible }: any) => (visible ? 1 : 0)}; // Controla a opacidade com base na visibilidade
`;

// Componente de Alerta
export const Alert = ({ msg }: any) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false) // Define a visibilidade como false após 2 segundos
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledAlert visible={visible}>
      {msg || ''}
    </StyledAlert>
  );
};

