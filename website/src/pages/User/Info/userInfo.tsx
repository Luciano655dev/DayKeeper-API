import { StyledBody, StyledContainer, StyledImage, StyledUsername, StyledEmail, StyledSubContainer, StyledEditProfileButton } from './userInfoCSS'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import axios from 'axios';
import { StyledButton } from '../Edit/editProfileCSS'
import { Alert } from '../../Post/Info/postInfoCSS'

export default function UserInfo() {
  const token = Cookies.get('userToken')
  const user = useSelector((state: any) => state.userReducer)
  const { name: userNameFromParams } = useParams()
  const [isFollowing, setIsFollowing] = useState(false)
  const [userInfo, setUserInfo]: any = useState({})
  const [sameUser, setSameUser]= useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const updateUserInfo = async()=>{
    const responseUserInfo = await axios.get(`http://localhost:3000/${userNameFromParams}`, { headers: { Authorization: `Bearer ${token}` } })
    const following = await axios.get(`http://localhost:3000/${userNameFromParams}/following`, { headers: { Authorization: `Bearer ${token}` } })
    setIsFollowing(responseUserInfo.data.user.followers.find( (userid: any) => userid == user.id))
    setUserInfo({...responseUserInfo.data.user, following: following.data.usersFollowing})
  }

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (userNameFromParams) {
          await updateUserInfo()

          if (userNameFromParams === user.name) {
            setSameUser(true)
            console.log('MESMO USUÁRIO')
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        setError('...')
        setLoading(false)
      }
    };

    getUserInfo();
  }, [userNameFromParams])

  const handleFollow = async()=>{
    setLoading(true)

    try{
      const response: any = await axios.post(`http://localhost:3000/${userNameFromParams}/follow`, {},
      { headers: { Authorization: `Bearer ${token}` } })
      await updateUserInfo()
      setIsFollowing(response.data.following)
    }catch(error: any){
      setMsg(error.response.data.msg)
    }

    setLoading(false)
  }

  if (loading) return <p>...</p>
  if (error) <p>{error}</p>

  return (
    <StyledBody>
      { msg ? <Alert style={{ backgroundColor: 'green' }} msg={msg}></Alert> : <></> }
      <StyledContainer>
        <StyledImage src={userInfo.profile_picture.url}></StyledImage>
        <StyledUsername>{userInfo.name}</StyledUsername>
        <StyledEmail>{userInfo.email}</StyledEmail>

        <StyledSubContainer>
          <h1>{userInfo.followers.length}</h1>
          <h1>{userInfo.following.length}</h1>
        </StyledSubContainer>

        { !isFollowing ?
          <StyledButton
            style={{
              margin: '1em',
              padding: '1em',
              width: '10vw',
              fontSize: '1em'
            }}
            onClick={handleFollow}
          >Follow</StyledButton>
          :
          <StyledButton
            style={{
              margin: '1em',
              padding: '1em',
              width: '10vw',
              fontSize: '1em',
              backgroundColor: 'red'
            }}
            onClick={handleFollow}
          >Unfollow</StyledButton>
        }

        {sameUser ?
          <StyledEditProfileButton to='/profile'>EDITAR PERFIL</StyledEditProfileButton> :
          <div></div>
        }
      </StyledContainer>
    </StyledBody>
  );
}