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

// TODO: colocar as páginas e Search Params

export default function Search(){
    const token = Cookies.get('userToken')
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const page: any = queryParams.get('page') || '1'
    const postsPerPage = 2
    const [maxPages, setMaxPages] = useState(1)

    const [searchTxt, setSearchTxt] = useState('')

    const [loading, setLoading] = useState(true)
    const [posts, setPosts]: any = useState([])
    const [error, setError] = useState('')

    const getPostDetails = async(post: any, id: String)=>{
        setLoading(true)
        try {
          const userResponse: any = await axios.get(`http://localhost:3000/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          return {
            ...post,
            path: `/${userResponse.data.user.name}/${post.title}`,
            user: {
                username: userResponse.data.user.name,
                pfp: userResponse.data.user.profile_picture.url,
            }
          }
        } catch (error: any) {
          setError(`${error.response.data.msg}`)
        }
        setLoading(false)
    }

    const updatePosts = async(response: any)=>{
        const postPromises = response.data.posts.map((post: any) => getPostDetails(post, post.user))
        const newPosts = await Promise.all(postPromises)

        const indexOfLastPost = Number(page) * postsPerPage
        const currentPosts = newPosts.slice((indexOfLastPost - postsPerPage), indexOfLastPost)
        setMaxPages(Math.ceil(newPosts.length / postsPerPage))
        setPosts(currentPosts)
        return currentPosts
    }

    useEffect(()=>{
        const getPosts = async () => {
            try {
                // posts: [{ title, user, created_at, ... }]
                const response: any = await axios.get('http://localhost:3000', { headers: { Authorization: `Bearer ${token}` } })
                const newPosts = await updatePosts(response)

                if(!newPosts.length) return setError(`404`)
            } catch (error) {
                setError(`${error}`)
            }
            setLoading(false)
          }
      
          getPosts()
    }, [page])

    const handleSearch = async()=>{
        setLoading(true)
        try{
            const response: any = await axios.get(`http://localhost:3000/search?q=${searchTxt}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            await updatePosts(response)
        }catch(error: any){
            if(error.response.status !- 404) setError(`${error}`)
            setLoading(false)
        }
        setLoading(false)
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

        <StyledContainer>
            {posts.map((post: any)=><StyledItem>
                <img src={post.user.pfp}></img>
                <label>{post.user.username}</label>
                <h1>{post.title}</h1>
                <StyledLink to={post.path}> <strong>Acesse aqui</strong> </StyledLink>
            </StyledItem>)}
        </StyledContainer>

        <div>
            { page-1 > 0 ? <StyledLink to={`/search?page=${page-1}`}><strong>{'<'}</strong></StyledLink> : <></> }
            { Number(page)+1 <= maxPages ? <StyledLink to={`/search?page=${Number(page)+1}`}><strong>{'>'}</strong></StyledLink> : <></> }
        </div>
    </StyledBody>
}