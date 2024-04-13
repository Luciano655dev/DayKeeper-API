import {
    StyledBody,
    StyledContainer,
    StyledItem,
    StyledInput,
    StyledSelectContainer,
    StyledButton
} from './searchCSS'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Page404 from '../404/Page404'

export default function Search(){
    const token = Cookies.get('userToken')
    const navigate = useNavigate()
    const location = useLocation()
    const containerRef = useRef(null)
    const queryParams = new URLSearchParams(location.search)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')

    // 0: type, 1: order, 2: following, 3: day
    const [filters, setFilters]: any = useState([
        `&type=${queryParams.get('type') || 'posts'}`,
        `&order=${queryParams.get('order') || 'relevant'}`,
        `&following=${queryParams.get('following') || 'false'}`
    ])

    const [loading, setLoading] = useState(true)
    const [data, setData]: any = useState(null)
    const [error, setError] = useState('')

    const loadPosts = async(newPage: Number, bool: Boolean)=>{
        try{
            const reqStr = `&q=${search}${filters.join('')}`
            const response: any = await axios.get(`http://localhost:3000/search?page=${newPage}&${reqStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setTotalPages(response.data.totalPages)

            if(bool)
                return setData([ ...response.data.data])

            if(data) return setData([ ...response.data.data, ...data])
            return setData(response.data.data)
        } catch (error: any) {
            console.log(error)
            setError(`${error}`)
        }

        return
    }

    // Infinite scroll
    const handleLoadMore = async () => {
        setPage((prevPage) => prevPage + 1)
        await loadPosts(page + 1, filters[0] == '&type=users')
    }

    useEffect(()=>{
        const updateData = async()=>{
            setLoading(true)

            try{
                const reqStr = `?&q=${search}${filters.join('')}`

                navigate(`/search${reqStr}`, { replace: true })

                await loadPosts(page, filters[0] == '&type=users')
            } catch (error: any) {
                console.log(error)
                setError(`${error}`)
            }

            setLoading(false)
        }

        updateData()
    }, [filters, search, page]) 

    const handleChangeOption = async(optionIndex: Number, parameter: String, newValue: String) =>{
        setData([])
        setPage(1)
        setFilters(filters.with(optionIndex, `&${parameter}=${newValue}`))
    }

    if(error) return <Page404></Page404>

    if(loading) return <StyledBody>
        <div>
            <StyledInput
                type='text'
                placeholder='search here'
                value={search}
                onChange={(e: any)=>setSearch(e.target.value)}
            ></StyledInput>

            <StyledSelectContainer>
                <select disabled value={queryParams.get('type') || 'posts'}>
                    <option value='posts'>POSTS</option>
                    <option value='users'>USERS</option>
                </select>

                <select disabled value={queryParams.get('order') || 'relevant'}>
                    <option value='relevant'>RELEVANT</option>
                    <option value='recent'>RECENT</option>
                </select>

                <select disabled value={queryParams.get('following') || 'false'}>
                    <option value='false'>NO</option>
                    <option value='following'>FOLLOWING</option>
                    <option value='friends'>FRIENDS</option>
                </select>
            </StyledSelectContainer>
        </div>
    </StyledBody>

    return <StyledBody>
        <div>
            <StyledInput
                type='text'
                placeholder='search here'
                value={search}
                onChange={(e: any)=>setSearch(e.target.value)}
            ></StyledInput>

            <StyledSelectContainer>
                <select value={queryParams.get('type') || 'posts'} onChange={ (e) => handleChangeOption(0, 'type', e.target.value) }>
                    <option value='posts'>POSTS</option>
                    <option value='users'>USERS</option>
                </select>

                <select value={queryParams.get('order') || 'relevant'} onChange={ (e) => handleChangeOption(1, 'order', e.target.value) }>
                    <option value='relevant'>RELEVANT</option>
                    <option value='recent'>RECENT</option>
                </select>

                <select value={queryParams.get('following') || 'false'} onChange={ (e) => handleChangeOption(2, 'following', e.target.value) }>
                    <option value='false'>NO</option>
                    <option value='following'>FOLLOWING</option>
                    <option value='friends'>FRIENDS</option>
                </select>
            </StyledSelectContainer>
        </div>

        <StyledContainer ref={containerRef}>
            { queryParams.get('type') != 'users' ? 
                data.map((post: any)=>
                    <StyledItem key={post._id} onClick={()=>navigate(`/${post.user_info.name}/${post.title}`)}>
                        <div className='upperContainer'>
                            <img src={post.user_info.profile_picture.url}></img>
                            <h1>{post.user_info.name}</h1>
                        </div>

                        <p>{post.data}</p>

                        <div className="filesContainer">
                            {
                                post.files ? post.files.map((file: any)=>
                                        file.mimetype.split('/')[0] == 'image' ?
                                            <img src={file.url} key={file._id}></img>
                                        :
                                            <video key={file._id} controls>
                                                <source src={file.url} type={file.mimetype}></source>
                                                <p>Seu browser não suporta esse arquivo</p>
                                            </video>
                                ) : <></>
                            }
                        </div>

                        <div className='bottomContainer'>
                            <div className='reactionsContainer'>
                                <div>
                                    { post.reactions[0] }
                                    😍
                                </div>
                                <div>
                                    { post.reactions[1] }
                                    😄
                                </div>
                                <div>
                                    { post.reactions[2] }
                                    😂
                                </div>
                                <div>
                                    { post.reactions[3] }
                                    😢
                                </div>
                                <div>
                                    { post.reactions[4] }
                                    😠
                                </div>
                            </div>
                            <div>
                                { post.comments }
                            </div>
                        </div>
                    </StyledItem>
                )

                :

                data.map((user: any)=>
                    <StyledItem key={user._id} onClick={()=>navigate(`/${user.name}`)}>
                        <img src={user.profile_picture.url}></img>
                        <h1>{user.name}</h1>
                    </StyledItem>
                )
            }

            {
                page < totalPages ? 
                    <StyledButton onClick={()=>handleLoadMore()}>Load More</StyledButton>
                    :
                    <></>
            }
        </StyledContainer>
    </StyledBody>
}
