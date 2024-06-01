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
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Page404 from '../404/Page404'

const Search = () => {
    const token = Cookies.get('userToken')
    const navigate = useNavigate()
    const location = useLocation()
    const containerRef = useRef<HTMLDivElement>(null)
    const queryParams = new URLSearchParams(location.search)

    const [page, setPage] = useState<number>(Number(queryParams.get('page')) || 1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [search, setSearch] = useState<string>('')
    const [filters, setFilters] = useState<string[]>([
        `&type=${queryParams.get('type') || 'Post'}`,
        `&order=${queryParams.get('order') || 'relevant'}`,
        `&following=${queryParams.get('following') || 'false'}`,
        `&page=${queryParams.get('page') || '1'}`
    ])
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData]: any = useState(null)
    const [error, setError] = useState<string>('')

    const loadPosts = async () => {
        try {
            const reqStr = `&q=${search}${filters.join('')}`
            const response = await axios.get(`http://localhost:3000/search?${reqStr}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setTotalPages(response.data.totalPages)
            setData(response.data.data)
        } catch (error: any) {
            console.error(error)
            setError(`${error}`)
        }
    }

    const handleChangePage = (direction: boolean) => {
        setLoading(true)
        const nextPage = direction ? Math.min(page + 1, totalPages) : Math.max(page - 1, 1)
        setPage(nextPage)
        handleChangeOption(3, `page`, `${nextPage}`)
        setLoading(false)
    }

    useEffect(() => {
        const updateData = async () => {
            setLoading(true)
            try {
                const reqStr = `?&q=${search}${filters.join('')}`
                navigate(`/search${reqStr}`, { replace: true })
                await loadPosts()
            } catch (error: any) {
                console.error(error)
                setError(`${error}`)
            }
            setLoading(false)
        }
        updateData()
    }, [filters, search])

    const handleChangeOption = (optionIndex: number, parameter: string, newValue: string) => {
        setData(null)
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters]
            newFilters[optionIndex] = `&${parameter}=${newValue}`
            return newFilters
        })
    }

    if (error) return <Page404 />
    if(loading) return <StyledBody>
        <div>
            <StyledInput
                type='text'
                placeholder='search here'
                disabled={true}
            />
            <StyledSelectContainer>
                <select disabled={true}>
                    <option value='Post'>POSTS</option>
                </select>
                <select disabled={true}>
                    <option value='relevant'>RELEVANT</option>
                </select>
                <select disabled={true}>
                    <option value='false'>NO</option>
                </select>
            </StyledSelectContainer>
        </div>
    </StyledBody>

    return (
        <StyledBody>
            <div>
                <StyledInput
                    type='text'
                    placeholder='search here'
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
                <StyledSelectContainer>
                    <select value={queryParams.get('type') || 'posts'} onChange={(e) => handleChangeOption(0, 'type', e.target.value)}>
                        <option value='Post'>POSTS</option>
                        <option value='User'>USERS</option>
                    </select>
                    <select value={queryParams.get('order') || 'relevant'} onChange={(e) => handleChangeOption(1, 'order', e.target.value)}>
                        <option value='relevant'>RELEVANT</option>
                        <option value='recent'>RECENT</option>
                    </select>
                    <select value={queryParams.get('following') || 'false'} onChange={(e) => handleChangeOption(2, 'following', e.target.value)}>
                        <option value='false'>NO</option>
                        <option value='following'>FOLLOWING</option>
                        <option value='friends'>FRIENDS</option>
                    </select>
                </StyledSelectContainer>
            </div>
            <StyledContainer ref={containerRef}>
                {data && (queryParams.get('type') !== 'User'
                    ? data.map((post: any) => (
                        <StyledItem key={post._id} onClick={() => navigate(`/${post.user_info.name}/${post.title}`)}>
                            <div className='upperContainer'>
                                <img src={post.user_info.profile_picture.url} alt="Profile" />
                                <h1>{post.user_info.name}</h1>
                            </div>
                            <p>{post.data}</p>
                            <div className="filesContainer">
                                {post.files?.map((file: any) =>
                                    file.mimetype.startsWith('image/') ? (
                                        <img src={file.url} key={file._id} alt="Post" />
                                    ) : (
                                        <video key={file._id} controls>
                                            <source src={file.url} type={file.mimetype} />
                                            <p>Your browser does not support this video format.</p>
                                        </video>
                                    )
                                )}
                            </div>
                            <div className='bottomContainer'>
                                <div className='reactionsContainer'>
                                    {['😍', '😄', '😂', '😢', '😠'].map((emoji, index) => (
                                        <div key={index}>
                                            {post.reactions.filter(({ reaction }: any) => reaction === index).length} {emoji}
                                        </div>
                                    ))}
                                </div>
                                <div>{post.comments}</div>
                            </div>
                        </StyledItem>
                    ))
                    : data.map((user: any) => (
                        <StyledItem key={user._id} onClick={() => navigate(`/${user.name}`)}>
                            <img src={user.profile_picture.url} alt="Profile" style={{ maxWidth: '10em', maxHeight: '10em' }} />
                            <h1>{user.name}</h1>
                        </StyledItem>
                    )))}
                {page < totalPages && <StyledButton onClick={() => handleChangePage(true)}>{'>'}</StyledButton>}
                {page > 1 && <StyledButton onClick={() => handleChangePage(false)}>{'<'}</StyledButton>}
            </StyledContainer>
        </StyledBody>
    )
}

export default Search