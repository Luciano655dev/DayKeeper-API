import {
    StyledBody,
    StyledContainer,
    StyledItem,
    StyledInput
} from './searchCSS'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

// TODO: colocar as páginas e Search Params

export default function Search(){
    const token = Cookies.get('userToken')
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState('')
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

    useEffect(()=>{
        const getPosts = async () => {
            try {
                // posts: [{ title, user, created_at, ... }]
                const response: any = await axios.get('http://localhost:3000', { headers: { Authorization: `Bearer ${token}` } })
                const postPromises = response.data.posts.map((post: any) => getPostDetails(post, post.user))
                setPosts(await Promise.all(postPromises))
                setLoading(false)
            } catch (error) {
                setError(`${error}`)
                setLoading(false)
            }
          }
      
          getPosts();
    }, [])

    if(error) return <h1>{error}</h1>
    if(loading) return <div>...</div>

    return <StyledBody>
        <StyledInput type='text' placeholder='search here'></StyledInput>
        <StyledContainer>
            {posts.map((post: any)=><StyledItem>
                <img src={post.user.pfp}></img>
                <label>{post.user.username}</label>
                <h1>{post.title}</h1>
                <Link to={post.path}>Acesse aqui</Link>
            </StyledItem>)}
        </StyledContainer>
    </StyledBody>
}