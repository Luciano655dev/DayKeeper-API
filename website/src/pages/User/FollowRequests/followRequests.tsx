import { StyledContainer } from './followRequestsCSS'
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import axios from 'axios'
import Page404 from '../../404/Page404'

export default function UserInfo() {
    const token = Cookies.get('userToken')
    const user = useSelector((state: any) => state.userReducer)
    const [followRequests, setFollowRequests]: any = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(false)

    const getUser = async(id: String)=>{
        try {
          const response: any = await axios.get(`http://localhost:3000/${id}`, { headers: { Authorization: `Bearer ${token}` } })
          return {
            username: response.data.user.name,
            pfp: response.data.user.profile_picture.url,
            id,
          }
        } catch (error: any) {
            console.log(error)
            setError(true)
        }
    }

    useEffect(()=>{
        const getFollowRequests = async()=>{
            setLoading(true)

            try{
                if(!user.private) return setError(true)
                const response = await axios.get(`http://localhost:3000/auth/user`, { headers: { Authorization: `Bearer ${token}` } })
                const usersPromises = response.data.user.follow_requests.map((followReq: String) => getUser(followReq))
                const users = await Promise.all(usersPromises)

                setFollowRequests(users || [])
            }catch(err: any){
                console.log(err)
                setError(true)
            }

            setLoading(false)
        }

        getFollowRequests()
    }, [msg])

    const handleResponse = async(accept: Boolean, username: String)=>{
        setLoading(true)

        try{
            const response = await axios.post(`http://localhost:3000/${username}/respond_follow?response=${accept}`, {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setMsg(response.data.msg)
        }catch(err: any){
            console.log(err)
            setError(true)
        }

        setLoading(false)
    }

    if(error) return <Page404></Page404>
    if(loading) return <div>...</div>

    return <div>
        { msg ? <h1>{msg}</h1> : <></> }
        <h1>Follow requests: </h1>
        {followRequests.map((followReq: any)=><StyledContainer key={followReq.id}>
            <img src={followReq.pfp}></img>
            <h1>{followReq.username}</h1>
            <button onClick={()=>handleResponse(true, followReq.username)}>Accept</button>
            <button onClick={()=>handleResponse(false, followReq.username)}>Decline</button>
        </StyledContainer>)}
    </div>
}