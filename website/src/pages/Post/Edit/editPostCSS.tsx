import styled from "styled-components";

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

export const StyledTitle = styled.label`
  display: block;
  margin-top: 0.5em;
  font-weight: bold;
  font-size: 2em;
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
    background-color: ${(props: any)=> props.backgroundColor ? props.backgroundColor : '#4caf50'};
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

export const StyledAlert = styled.div`
  padding: 10px;
  background-color: #f44336;
  color: white;
  margin-top: 10px;
  border-radius: 5px;
`