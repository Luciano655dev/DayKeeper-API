import {
  StyledContainer,
  StyledImage,
  StyledUsername,
  StyledEmail,
  StyledSubContainer,
  StyledEditProfileButton,
  StyledFollowLink,
  StyledPostsLink,
  StyledReportButton,
  buttonStyle
} from './userInfoCSS'
import { StyledButton } from '../Edit/editProfileCSS'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Alert } from '../../Post/Render/Info/postInfoCSS'
import Page404 from '../../404/Page404'

export default function UserInfo() {
  const token = Cookies.get('userToken')
  const user = useSelector((state: any) => state.userReducer)
  const { name: userNameFromParams } = useParams()
  const sameUser = userNameFromParams === user.name

  const [state, setState]: any = useState({
    isFollowing: false,
    isBlocked: false,
    activeBlockButton: true,
    activeFollowButton: true,
    userInfo: {},
    loading: true,
    error: '',
    msg: '',
  })

  const updateUserInfo = async () => {
    try {
      const [responseUserInfo, following] = await Promise.all([
        axios.get(`http://localhost:3000/${userNameFromParams}`,
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3000/${userNameFromParams}/following`,
          { headers: { Authorization: `Bearer ${token}` } })
      ])

      const userStatus = responseUserInfo.data.user.status
      setState((prevState: any) => ({
        ...prevState,
        isFollowing: userStatus === 'following',
        isBlocked: userStatus === 'blocked',
        activeBlockButton: userStatus === 'following' || userStatus === 'default',
        activeFollowButton: userStatus === 'following' || userStatus === 'default',
        userInfo: { ...responseUserInfo.data.user, following: following.data.users },
        loading: false
      }))
    } catch (error: any) {
      setState((prevState: any) => ({
        ...prevState,
        error: error.toString(),
        loading: false
      }))
    }
  }

  useEffect(() => {
    updateUserInfo()
  }, [userNameFromParams])

  const handleAction = async (url: any) => {
    setState((prevState: any) => ({ ...prevState, loading: true }))
    try {
      const response = await axios.post(`http://localhost:3000/${userNameFromParams}/${url}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      await updateUserInfo()
      setState((prevState: any) => ({ ...prevState, msg: response.data.message, loading: false }))
    } catch (error: any) {
      setState((prevState: any) => ({ ...prevState, msg: error.response.data.message, loading: false }))
    }
  }

  if (state.loading) return <div>loading...</div>
  if (state.error) return <Page404 />

  return (
    <div>
      {state.msg && <Alert style={{ backgroundColor: 'green' }} msg={state.msg} />}
      <StyledContainer>
        <StyledImage src={state.userInfo.profile_picture.url} />
        <StyledUsername>{state.userInfo.name}</StyledUsername>
        <StyledEmail>{state.userInfo.bio}</StyledEmail>

        <StyledSubContainer>
          <StyledPostsLink to={`/${state.userInfo.name}/posts`}>POSTS</StyledPostsLink>
          <div>
            <StyledFollowLink to={`/${state.userInfo.name}/followers`}>{state.userInfo.followers}</StyledFollowLink>
            <StyledFollowLink to={`/${state.userInfo.name}/following`}>{state.userInfo.following.length}</StyledFollowLink>
          </div>
        </StyledSubContainer>

        <StyledButton
          disabled={!state.activeFollowButton}
          style={{ ...buttonStyle, backgroundColor: state.isFollowing ? 'red' : undefined }}
          onClick={() => handleAction('follow')}
        >
          {state.isFollowing ? 'Unfollow' : 'Follow'}
        </StyledButton>

        <StyledButton
          disabled={!state.activeBlockButton}
          style={{ ...buttonStyle, backgroundColor: state.isBlocked ? undefined : 'red' }}
          onClick={() => handleAction('block')}
        >
          {state.isBlocked ? 'Unblock' : 'Block'}
        </StyledButton>

        <StyledReportButton onClick={() => handleAction('report')}>REPORT USER</StyledReportButton>

        {sameUser && <StyledEditProfileButton to="/profile">EDITAR PERFIL</StyledEditProfileButton>}
      </StyledContainer>
    </div>
  )
}
