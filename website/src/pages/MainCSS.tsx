import styled from 'styled-components'

export const StyledMain = styled.div`
    width: 100vw;
    height: 93vh;
    background-color: #EBECF0;
    /*#EBECF0*/

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;

    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 5px;
    }
`