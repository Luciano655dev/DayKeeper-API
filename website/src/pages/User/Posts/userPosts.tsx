import {
    StyledBody,
    StyledContainer,
    StyledItem,
    StyledSearchBox,
    StyledLink,
    StyledButton,
    StyledSelectContainer
} from './userPostsCSS'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Page404 from '../../404/Page404'

export default function UserPosts(){
    const token = Cookies.get('userToken')
    const navigate = useNavigate()
    const location = useLocation()
    const { name: userNameFromParams } = useParams()
    const queryParams = new URLSearchParams(location.search)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // 0: type, 1: order, 2: following, 3: day
    const [order, setOrder]: any = useState(queryParams.get('order') || 'relevant')

    const [loading, setLoading] = useState(true)
    const [data, setData]: any = useState([])
    const [error, setError] = useState('')

    useEffect(()=>{
        const updateData = async()=>{
            setLoading(true)

            try{
                const reqStr = `?page=${page}&q=${userNameFromParams}&order=${order}`
                const response: any = await axios.get(`http://localhost:3000/${userNameFromParams}/posts${reqStr}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                console.log(response.data.data)

                setData(response.data.data)
                setTotalPages(response.data.totalPages)

                navigate(`/${userNameFromParams}/posts${reqStr}`, { replace: true })
            } catch (error: any) {
                console.log(error)
                setError(`${error}`)
            }

            setLoading(false)
        }

        updateData()
    }, [order, page])

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

    const handleChangeOrder = () =>
        setOrder(order == 'recent' ? 'relevant' : 'recent')

    if(error) return <Page404></Page404>
    if(loading) return <StyledBody>
        <StyledSearchBox>
            <StyledSelectContainer>
                <select disabled value={queryParams.get('order') || 'relevant'}>
                    <option value='relevant'>RELEVANT</option>
                    <option value='recent'>RECENT</option>
                </select>
            </StyledSelectContainer>
        </StyledSearchBox>
    </StyledBody>

    return <StyledBody>
        <StyledSearchBox>
            <StyledSelectContainer>
                <select value={queryParams.get('order') || 'relevant'} onChange={()=>handleChangeOrder()}>
                    <option value='relevant'>RELEVANT</option>
                    <option value='recent'>RECENT</option>
                </select>
            </StyledSelectContainer>
        </StyledSearchBox>

        <StyledContainer>
            {
                data.map((post: any)=>
                    <StyledItem key={post._id}>
                        <img src={post.user_info.profile_picture.url}></img>
                        <label>{post.user_info.name}</label>
                        <h1>{post.title}</h1>
                        <StyledLink to={`http://localhost:5173/${post.user_info.name}/${post.title}`}> <strong>Acesse aqui</strong> </StyledLink>
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
