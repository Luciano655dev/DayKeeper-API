import styled from 'styled-components'

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