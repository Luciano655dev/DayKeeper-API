import styled from "styled-components";

export const StyledBody = styled.div`
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 92vh;
  width: 100vw;
  background-color: #EEEEEE;
`;

export const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 10em;
  border-radius: 8px;

  .inputClass {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;

    label {
      font-weight: 500;
      margin: 0.3em;
    }
  }

  .linksContainer {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5em;
    font-size: 0.8em;

    a {
      color: #0969DC;
      margin-left: 0.2em;
    }
  }
`;

export const StyledInput = styled.input`
  width: 30em;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 1em;

  a {
    color: #0969DC;
  }
  label {
    font-size: 0.8em;
    margin: 0;
  }

  input[type="checkbox"] {
    position: relative;
    margin: 0;
    margin-right: 0.5em;
    cursor: pointer;
  }
`;

export const StyledButton = styled.button`
  background-color: #4caf50;
  color: white;
  margin-top: 1em;
  margin-bottom: 1em;

  border: none;
  border-radius: 5px;

  width: 25em;
  padding: 10px;

  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
  opacity: ${(props: any) => (!props.enabled ? 0.5 : 1)};
`;

export const StyledAlert = styled.div`
  color: #f44336;
  text-decoration: underline;
  margin-bottom: 1em;
`;
