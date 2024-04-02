import {
    StyledGifContainer,
    StyledGifSearchContainer,
    StyledButton
} from './postGifsCSS'
import Page404 from '../../../../pages/404/Page404'
import { useEffect, useState } from "react"
import axios from 'axios'

export default function PostGifs({ handleSelectGif }: any){
    const api_key = 'fzRhwakZC0q3AvSUuBo03vp6IIkAAG36'
    const [gifs, setGifs] = useState([])
    const [gifSearch, setGifSearch]: any = useState('')
    const [gifSearchTxt, setGifSearchTxt]: any = useState('')
    const [openGifSection, setOpenGifSection] = useState(false)
    const [gifsLoading, setGifsLoading] = useState(true)

    const [error, setError] = useState(false)

    const handleOpenGifSection = ()=>{
    
        setOpenGifSection(!openGifSection)
    }

    const handleSearchGif = ()=>{
        setGifSearch(gifSearchTxt)
    }

    useEffect(()=>{
        const updateGifs = async()=>{
          setGifsLoading(true)
    
          try{
            let reqStr = `http://api.giphy.com/v1/gifs/trending?api_key=${api_key}`
    
            if(gifSearch != '')
              reqStr = `http://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=${api_key}`
    
            const response = await axios.get(reqStr)
      
            setGifs(response.data.data.map((gifObj: any) => {
              return {
                name: gifObj.title,
                id: gifObj.id,
                url: gifObj.images.original.url
              }
            }))
          }catch (error: any) {
            setError(error.response.data)
          }
    
          setGifsLoading(false)
        }
    
        updateGifs()
    }, [gifSearch])

    if(error) return <Page404></Page404>

    return <div>
        <StyledButton
            style={{
                backgroundColor: openGifSection ? 'red' : '#4caf50'
            }}
            onClick={()=>handleOpenGifSection()}
        >Gifs</StyledButton>
        {
            openGifSection ?
                <StyledGifContainer>
                    <StyledGifSearchContainer>
                    <input
                        type='text'
                        placeholder='search for gif'
                        onChange={(e)=>setGifSearchTxt(e.target.value)}
                    ></input>
                    <button
                        onClick={handleSearchGif}
                    >Search</button>
                    </StyledGifSearchContainer>
                    {
                    !gifsLoading ?
                        gifs.map((gif: any)=>
                            <div onClick={() => handleSelectGif(gif)} key={Math.random()}>
                                <img src={gif.url}></img>
                            </div>
                        )
                    : <div></div>
                    }
                </StyledGifContainer>
                :
                <></>
        }
    </div>
}