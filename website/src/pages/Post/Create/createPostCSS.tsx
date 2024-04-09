import styled from "styled-components";

export const StyledBody = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: start;
  height: 92vh;
  width: 100vw;
  background-color: #EEEEEE;
`;

export const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 50vw;

  border-radius: 8px;

  .imagesContainer {
    input[type="file"] {
      display: none;
    }

    label {
      cursor: pointer;

      display: flex;
      justify-content: center;
      align-items: center;

      margin: 1em;
      width: 7em;

      img {
        width: 2.5em;
        height: 2em;
        border: 1px solid black;
        margin-right: 0.2em;
      }

      background-color: black;
      opacity: 50%;
      font-size: 20px;
      color: white;
      padding: 0.2em;

      transition: 0.3s;
      &:hover {
        opacity: 100%;
      }
    }
  }

  .imageContainer {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50vw;
    height: 30vh;

    button {
      position: absolute;
      bottom: 0;
      margin: 0;
      transform: translateX(5em);

      display: flex;
      justify-content: center;
      align-items: center;

      width: 4em;
      height: 4em;
      border-radius: 50%;

      background-color: black;
      color: white;
      opacity: 50%;
      font-size: 20px;

      margin-bottom: 1em;
      margin-right: 2em;

      transition: 0.3s;
      &:hover {
        opacity: 100%;
      }
    }
  }

  .imagesPreview {
    display: flex;
    flex-direction: row;
    max-width: 40vw;
    max-height: 30vh;
    overflow-x: scroll;

    div {
      position: relative;
      margin: 10px;
    }

    img {
      border: 1px solid black;
    }

    button {
      position: absolute;
      top: 5px;
      left: 5px;
      background-color: red;
      border: none;
      cursor: pointer;
      color: white;
      font-weight: bold;

      transition: 0.3s;
      &:hover {
        background-color: darkred;
      }
    }
  }

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
`

export const StyledTextArea = styled.textarea`
  width: 30em;
  min-height: 5em;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  font-size: 1em;
`

export const StyledCheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
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
