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
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  margin-top: 10px;
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

