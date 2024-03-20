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
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')

    const [loading, setLoading] = useState(true)
    const [posts, setPosts]: any = useState([])
    const [error, setError] = useState('')

    useEffect(()=>{
        const getPosts = async () => {
            try {
                const response: any = await axios.get(`http://localhost:3000/search?{params from options}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                setTotalPages(response.data.totalPages)
                setPosts(response.data.posts)
            } catch (error: any) {
                console.log(error)
                setError(`${error}`)
            }
            setLoading(false)
          }
      
          getPosts()
    }, [])

    const handleSearch = async()=>{
        setLoading(true)
        try{
            const response: any = await axios.get(`http://localhost:3000/search?page=${page}&q=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setTotalPages(response.data.totalPages)
            setPosts(response.data.posts)
        }catch(error){
            console.log(error)
            setError(`${error}`)
        }
        setLoading(false)
    }

    const handleChangePage = async(direction: boolean)=>{
        setLoading(true)
        try{
            let nextPage = Math.max(page - 1, 1)
            if(direction) // aumentar
                nextPage = Math.min(page + 1, totalPages)
    
            setPage(nextPage)
    
            const response: any = await axios.get(`http://localhost:3000/search?page=${nextPage}&q=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
    
            setPosts(response.data.posts)
        }catch(error){
            console.log(error)
            setError(`${error}`)
        }
        setLoading(false)
    }

    if(error) return <Page404></Page404>
    if(loading) return <StyledBody>
        <StyledSearchBox>
            <StyledInput
                type='text'
                onChange={(e: any)=>setSearch(e.target.value)}
                value={search}
                placeholder='search here'
            ></StyledInput>
            <StyledButton onClick={handleSearch}>Send</StyledButton>
        </StyledSearchBox>
    </StyledBody>

    return <StyledBody>
        <StyledSearchBox>
            <StyledInput
                type='text'
                onChange={(e: any)=>setSearch(e.target.value)}
                value={search}
                placeholder='search here'
            ></StyledInput>
            <StyledButton onClick={handleSearch}>Send</StyledButton>
        </StyledSearchBox>

        <StyledContainer>
            {posts.map((post: any)=>
                <StyledItem key={post._id}>
                    <img src={post.user_info.profile_picture.url}></img>
                    <label>{post.user_info.name}</label>
                    <h1>{post.title}</h1>
                    <StyledLink to={`http://localhost:5173/${post.user_info.name}/${post.title}`}> <strong>Acesse aqui</strong> </StyledLink>
                </StyledItem>
            )}
        </StyledContainer>

        <div>
            {
                page - 1 > 0 ?
                    <StyledButton onClick={()=>handleChangePage(false)}> <strong>{'<'}</strong> </StyledButton> :
                    null
            }

            {
                page + 1 <= totalPages ?
                    <StyledButton onClick={()=>handleChangePage(true)}> <strong>{'>'}</strong> </StyledButton> :
                    null
            }
        </div>
    </StyledBody>
}
