import {
    StyledBody,
    StyledContainer,
    StyledItem,
    StyledInput,
    StyledSearchBox,
    StyledLink,
    StyledButton,
    StyledSelectContainer
} from './searchCSS'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Page404 from '../404/Page404'

export default function Search(){
    const token = Cookies.get('userToken')
    const navigate = useNavigate()
    const location = useLocation()
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
    const [data, setData]: any = useState([])
    const [error, setError] = useState('')

    useEffect(()=>{
        const updateData = async()=>{
            setLoading(true)

            try{
                const reqStr = `?page=${page}&q=${search}${filters.join('')}`
                const response: any = await axios.get(`http://localhost:3000/search${reqStr}`, { headers: { Authorization: `Bearer ${token}` } } )

                setData(response.data.data)
                setTotalPages(response.data.totalPages)

                navigate(`/search${reqStr}`, { replace: true })
            } catch (error: any) {
                console.log(error)
                setError(`${error}`)
            }

            setLoading(false)
        }

        updateData()
    }, [filters, search, page])

    const handleChangePage = async(direction: boolean)=>{
        setLoading(true)

        try{
            let nextPage = Math.max(page - 1, 1)
            if(direction) // aumentar
                nextPage = Math.min(page + 1, totalPages)
    
            setPage(nextPage)
        }catch(error){
            setError(`${error}`)
        }

        setLoading(false)
    }

    const handleChangeOption = async(optionIndex: Number, parameter: String, newValue: String) =>
        setFilters(filters.with(optionIndex, `&${parameter}=${newValue}`))

    if(error) return <Page404></Page404>
    if(loading) return <StyledBody>
        <StyledSearchBox>
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
        </StyledSearchBox>
    </StyledBody>

    return <StyledBody>
        <StyledSearchBox>
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
        </StyledSearchBox>

        <StyledContainer>
            { queryParams.get('type') != 'users' ? 
                data.map((post: any)=>
                    <StyledItem key={post._id}>
                        <img src={post.user_info.profile_picture.url}></img>
                        <label>{post.user_info.name}</label>
                        <h1>{post.title}</h1>
                        <StyledLink to={`http://localhost:5173/${post.user_info.name}/${post.title}`}> <strong>Acesse aqui</strong> </StyledLink>
                    </StyledItem>
                )

                :

                data.map((user: any)=>
                    <StyledItem key={user._id}>
                        <img src={user.profile_picture.url}></img>
                        <h1>{user.name}</h1>
                        <StyledLink to={`http://localhost:5173/${user.name}`}> <strong>Acesse aqui</strong> </StyledLink>
                    </StyledItem>
                )
            }
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
