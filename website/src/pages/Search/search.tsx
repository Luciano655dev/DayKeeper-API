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

    const [page, setPage] = useState(Number(queryParams.get('page')) || 1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')

    // 0: type, 1: order, 2: following, 3: day
    const [filters, setFilters]: any = useState([
        `&type=${queryParams.get('type') || 'Post'}`,
        `&order=${queryParams.get('order') || 'relevant'}`,
        `&following=${queryParams.get('following') || 'false'}`,
        `&page=${queryParams.get('page') || '1'}`
    ])

    const [loading, setLoading] = useState(true)
    const [data, setData]: any = useState(null)
    const [error, setError] = useState('')

    const loadPosts = async(newPage: Number)=>{
        try{
            const reqStr = `&q=${search}${filters.join('')}`
            const response: any = await axios.get(`http://localhost:3000/search?page=${newPage}&${reqStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setTotalPages(response.data.totalPages)

            return setData(response.data.data)
        } catch (error: any) {
            console.log(error)
            setError(`${error}`)
        }

        return
    }

    // Infinite scroll
    const handleChangePage = async(direction: boolean)=>{
        setLoading(true)

        try{
            let nextPage = Math.max(page - 1, 1)
            if(direction) // aumentar
                nextPage = Math.min(page + 1, totalPages)
    
            setPage(nextPage)
            setFilters(filters.with(3, `&page=${nextPage}`))
        }catch(error){
            setError(`${error}`)
        }

        setLoading(false)
    }

    useEffect(()=>{
        const updateData = async()=>{
            setLoading(true)

            try{
                const reqStr = `?&q=${search}${filters.join('')}`

                navigate(`/search${reqStr}`, { replace: true })

                await loadPosts(page)
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
                    <option value='Post'>POSTS</option>
                    <option value='User'>USERS</option>
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
                    <option value='Post'>POSTS</option>
                    <option value='User'>USERS</option>
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
            { queryParams.get('type') != 'User' ? 
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
                                    { post.reactions.filter(({ reaction }: any) => reaction == 0).length }
                                    😍
                                </div>
                                <div>
                                    { post.reactions.filter(({ reaction }: any) => reaction == 1).length }
                                    😄
                                </div>
                                <div>
                                    { post.reactions.filter(({ reaction }: any) => reaction == 2).length }
                                    😂
                                </div>
                                <div>
                                    { post.reactions.filter(({ reaction }: any) => reaction == 3).length }
                                    😢
                                </div>
                                <div>
                                    { post.reactions.filter(({ reaction }: any) => reaction == 4).length }
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
                        <img src={user.profile_picture.url} style={{ maxWidth: `10em`, maxHeight: `10em` }}></img>
                        <h1>{user.name}</h1>
                    </StyledItem>
                )
            }

            {
                page < totalPages ? 
                    <StyledButton onClick={()=>handleChangePage(true)}>{`>`}</StyledButton>
                    :
                    <></>
            }
            {
                page > 1 ? 
                    <StyledButton onClick={()=>handleChangePage(false)}>{`<`}</StyledButton>
                    :
                    <></>
            }
        </StyledContainer>
    </StyledBody>
}
