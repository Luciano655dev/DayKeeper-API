import { StyledBody, StyledContainer, StyledImage, StyledUsername, StyledEmail, StyledSubContainer, StyledEditProfileButton } from './userInfoCSS'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function UserInfo() {
  const { name: userNameFromParams } = useParams();
  const [userInfo, setUserInfo] = useState({
    profile_picture: { url: '' },
    name: '',
    email: '',
    followers: [],
    following: []
  })
  const [sameUser, setSameUser]= useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) return setLoading(false)

        const responseLoggedInUser = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })

        if (userNameFromParams) {
          const responseUserInfo = await axios.get(`http://localhost:3000/${userNameFromParams}`, { headers: { Authorization: `Bearer ${token}` } })
          const following = await axios.get(`http://localhost:3000/${userNameFromParams}/following`, { headers: { Authorization: `Bearer ${token}` } })
          setUserInfo({...responseUserInfo.data.user, following: following.data.usersFollowing})

          if (responseUserInfo.data.user.name === responseLoggedInUser.data.user.name) {
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
  }, [userNameFromParams]);

  if (loading || !userInfo) return <p>...</p>
  if (error) <p>{error}</p>

  return (
    <StyledBody>
      <StyledContainer>
        <StyledImage src={userInfo.profile_picture.url}></StyledImage>
        <StyledUsername>{userInfo.name}</StyledUsername>
        <StyledEmail>{userInfo.email}</StyledEmail>

        <StyledSubContainer>
          <h1>{userInfo.followers.length}</h1>
          <h1>{userInfo.following.length}</h1>
        </StyledSubContainer>

        {sameUser ?
          <StyledEditProfileButton to='/profile'>EDITAR PERFIL</StyledEditProfileButton> :
          <div></div>
        }
      </StyledContainer>
    </StyledBody>
  );
}