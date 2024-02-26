import styled from "styled-components"

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
    width: 50vw;
    height: 70vh;
`

export const StyledItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: auto;
    border: 1px solid black;
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

export const StyledInput = styled.input`
    position: absolute;
    top: 5vw;
    width: 50%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`
