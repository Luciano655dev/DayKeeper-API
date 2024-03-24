import { StyledBody, StyledContainer, StyledLink } from './followingCSS'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios'
import Page404 from '../../404/Page404'

export default function Followers() {
    const token = Cookies.get('userToken')
    const user = useSelector((state: any) => state.userReducer)
    const { name: userNameFromParams } = useParams()
    const sameUser = userNameFromParams === user.name
    const [followRequests, setFollowRequests]: any = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(false)

    useEffect(()=>{
        const getFollowing = async()=>{
            setLoading(true)

            try{
                const userResponse: any = await axios.get(`http://localhost:3000/${userNameFromParams}`, { headers: { Authorization: `Bearer ${token}` } })

                if(
                    !sameUser && (
                        userResponse.data.user.private && // caso a conta seja privada
                        !userResponse.data.user.followers.includes((userId: String) => userId == user.id) // e você não esteja seguindo
                    )
                ) return setError(true)

                const followingResponse: any = await axios.get(`http://localhost:3000/${userNameFromParams}/following`, 
                    { headers: { Authorization: `Bearer ${token}` } })

                setFollowRequests(
                    followingResponse.data.usersFollowing.map((user: any) => { return {
                        username: user.name,
                        pfp: user.profile_picture.url,
                        id: user._id
                    }})
                )
            }catch(err: any){
                console.log(err)
                setError(true)
            }

            setLoading(false)
        }

        getFollowing()
    }, [msg])

    // mesma coisa do 'handleFollow' no userInfo
    const handleUnfollow = async(username: String)=>{
        setLoading(true)

        try{
          const response: any = await axios.post(`http://localhost:3000/${username}/follow`, {},
          { headers: { Authorization: `Bearer ${token}` } })

          setMsg(response.data.msg)
        }catch(error: any){
          setMsg(error.response.data.msg)
        }
    
        setLoading(false)
    }

    if(error) return <Page404></Page404>
    if(loading) return <div>...</div>

    return <StyledBody>
        { msg ? <h1>{msg}</h1> : <></> }
        <h1>Following: </h1>
        {followRequests.map((followReq: any)=><StyledContainer key={followReq.id}>
            <img src={followReq.pfp}></img>
            <StyledLink to={`/${followReq.username}`}>{followReq.username}</StyledLink>
            { sameUser ? 
                <button
                    onClick={()=>handleUnfollow(followReq.username)}
                >Unfollow</button>
                :
                <></>
            }
        </StyledContainer>)}
    </StyledBody>
}