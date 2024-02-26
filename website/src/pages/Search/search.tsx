import {
    StyledBody,
    StyledContainer,
    StyledItem,
    StyledInput,
    StyledSearchBox,
    StyledLink,
    StyledButton
} from './searchCSS'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Page404 from '../404/Page404'

export default function Search(){
    const token = Cookies.get('userToken')
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const page: any = queryParams.get('page') || '1'
    const postsPerPage = 2
    const [maxPages, setMaxPages] = useState(1)

    // Filters
    const order = queryParams.get('order') || 'recent' // recent or relevant

    const [searchTxt, setSearchTxt] = useState('')

    const [loading, setLoading] = useState(true)
    const [posts, setPosts]: any = useState([])
    const [error, setError] = useState('')

    const updatePosts = async(response: any)=>{
        const newPosts = response.data.posts

        const indexOfLastPost = Number(page) * postsPerPage
        const currentPosts = newPosts.slice((indexOfLastPost - postsPerPage), indexOfLastPost)
        setMaxPages(Math.ceil(newPosts.length / postsPerPage))
        setPosts(currentPosts)
        return currentPosts
    }

    useEffect(()=>{
        const getPosts = async () => {
            try {
                let reqStr = `http://localhost:3000/search?q=${searchTxt}&order=${order}&page=${page}`
                // posts: [{ title, user, created_at, ... }]
                const response: any = await axios.get(reqStr, { headers: { Authorization: `Bearer ${token}` } })
                await updatePosts(response)
            } catch (error) {
            }
            setLoading(false)
          }
      
          getPosts()
    }, [page, order])

    const handleSearch = async()=>{
        setLoading(true)
        try{
            let reqStr = `http://localhost:3000/search?q=${searchTxt}&order=${order}&page=${page}`
            const response: any = await axios.get(reqStr,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            await updatePosts(response)
        }catch(error: any){
            if(error.response.status !== 404) setError(`${error}`)
            setLoading(false)
        }
        setLoading(false)
    }

    const handleChangePage = (newPage: String)=>{
        if(newPage === '<') {
            const nextPage = Math.max(Number(page) - 1, 1)
            const newUrl = `?page=${nextPage}&order=${order}`
            window.location.href = newUrl
        } else {
            const nextPage = Math.min(Number(page) + 1, maxPages)
            const newUrl = `?page=${nextPage}&order=${order}`
            window.location.href = newUrl
        }
    }

    const handleOrderChange = () => {
        const newUrl = `?page=1&order=${order == 'recent' ? 'relevant' : 'recent'}`
        window.location.href = newUrl
    }

    if(error) return <Page404></Page404>
    if(loading) return <StyledBody>
        <StyledSearchBox>
            <StyledInput
                type='text'
                onChange={(e: any)=>setSearchTxt(e.target.value)}
                value={searchTxt}
                placeholder='search here'
            ></StyledInput>
            <StyledButton onClick={handleSearch}>Send</StyledButton>
        </StyledSearchBox>
    </StyledBody>

    return <StyledBody>
        <StyledSearchBox>
            <StyledInput
                type='text'
                onChange={(e: any)=>setSearchTxt(e.target.value)}
                value={searchTxt}
                placeholder='search here'
            ></StyledInput>
            <StyledButton onClick={handleSearch}>Send</StyledButton>
        </StyledSearchBox>

        {/* Filter buttons */}
        <div>
            <StyledButton onClick={() => handleOrderChange()}>{order == 'recent' ? 'Relevant' : 'Recent'}</StyledButton>
        </div>

        <StyledContainer>
            {posts.map((post: any)=>
                <StyledItem>
                    <img src={post.user_info.profile_picture.url}></img>
                    <label>{post.user_info.name}</label>
                    <h1>{post.title}</h1>
                    <StyledLink to={post.path}> <strong>Acesse aqui</strong> </StyledLink>
                </StyledItem>
            )}
        </StyledContainer>

        <div>
            { Number(page) - 1 > 0 ? <StyledButton onClick={()=>handleChangePage('<')}> <strong>{'<'}</strong> </StyledButton> : null }
            { Number(page) + 1 <= maxPages ? <StyledButton onClick={()=>handleChangePage('>')}> <strong>{'>'}</strong> </StyledButton> : null }
        </div>
    </StyledBody>
}
