import {
  GlobalStyle,
  Container,
  Logo,
  StyledLink,
  Sidebar,
  SidebarArea,
  StyledSidebarLink
} from './navbarCSS';
import Dropdown from './dropDown';

import { FaSearch } from "react-icons/fa"
import { FaHome } from "react-icons/fa"
import { FaBook } from "react-icons/fa"
import { FaPhoneAlt } from "react-icons/fa"
import { FaPlusSquare } from "react-icons/fa"

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Navbar() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [questionInfo, setQuestionInfo]: any = useState({ day: '', question: '' })
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async()=>{
      const storedToken = Cookies.get('userToken')
      const date = new Date()
      const todayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getFullYear())}`

      try {
        // fetch question data
        const questionResponse = await axios.get(`http://localhost:3000/question/${todayDate}`,
        { headers: { Authorization: `Bearer ${storedToken}` } })


        setQuestionInfo(questionResponse.data)
        setToken(storedToken || '')
      }catch(error){
        console.log(error)
      }
      setLoading(false)
    }

    fetchData()
  }, [location])

  const handleLogout = () => {
    Cookies.remove('userToken')
    setToken('')
    navigate('/')
  }

  if(loading) return <Container></Container>

  return (
    <div>
      <Container>
        <GlobalStyle></GlobalStyle>
        <div className='logoContainer'>
          <Logo>DayKeeper</Logo>
        </div>

        {
          loading ? null : token.length ? <div className='dayInfo'>
            <h1>{questionInfo.day}</h1>
            <h2> . {questionInfo.question}</h2>
          </div> : <></>
        }

        <div className='userDiv'>
          {loading ? null : token.length ? (
            <div className='user'>
              <button onClick={()=>navigate('/publish')}>
                <FaPlusSquare></FaPlusSquare>
                CREATE
              </button>
              <Logged
                location={'navbar'}
                token={token}
                handleLogout={handleLogout}
              />
            </div>
          ) : (
            <NotLogged />
          )}
        </div>
      </Container>

      <Sidebar>
        <SidebarArea>
          <StyledSidebarLink to={'/'}>
            <FaHome></FaHome>
            <span>Pagina inicial</span>
          </StyledSidebarLink>
          <StyledSidebarLink to={'/search'}>
            <FaSearch></FaSearch>
            <span>Pesquisa</span>
          </StyledSidebarLink>
        </SidebarArea>

        { loading ? null : token.length ? <SidebarArea>
          <Logged
            location={'sidebar'}
            token={token}
            handleLogout={handleLogout}
          />
        </SidebarArea> : <></> }

        <SidebarArea>
          <StyledSidebarLink to={'/terms'}>
            <FaBook></FaBook>
            <span>Termos e condições</span>
          </StyledSidebarLink>
          <StyledSidebarLink to={'/contact'}>
            <FaPhoneAlt></FaPhoneAlt>
            <span>Contato</span>
          </StyledSidebarLink>
        </SidebarArea>
      </Sidebar>
    </div>
  );
}

function Logged({ token, handleLogout, location }: any) {
  const navigate = useNavigate()
  const [userInfo, setUserInfo]: any = useState({ name: '', profile_picture: { url: '' } })
  const [userFollowing, setUserFollowing]: any = useState({ usersFollowing: [] })
  const [loadingUser, setLoadingUser] = useState(true)
  const [error, setError]: any = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch user data
        const userResponse = await axios.get('http://localhost:3000/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUserInfo(userResponse.data.user)

        // fetch user friends Data
        const followingResponse: any = await axios.get(`http://localhost:3000/${userResponse.data.user.name}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserFollowing(followingResponse.data.users)
      } catch (error) {
        setError('Error fetching user information');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  if (loadingUser) return null;
  if (error) return <li>{error}</li>;

  const options = [
    {
      text: 'Config',
      func: () => navigate('/profile'),
    },
    {
      text: 'Calendar',
      func: () => navigate(`/${userInfo.name}/posts`)
    },
    {
      text: 'Log Out',
      func: handleLogout,
    }
  ]

  if(location == 'navbar') return (
    <div>
      <Dropdown text={userInfo.name} url={userInfo.profile_picture.url} options={
        userInfo.private ?
          [ ...options, { text: 'Follows', func: ()=>navigate('/follow_requests') } ] :
          options
      } />
    </div>
  )

  if(location == 'sidebar') return <div>
      { userFollowing.map((user: any)=>
        <StyledSidebarLink key={user._id} to={`/${user.name}`}>
          <img src={user.profile_picture.url}></img>
          {user.name}
        </StyledSidebarLink>
      ) }
    </div>
}

function NotLogged() {
  return (
    <div>
      <p><StyledLink to='/login'>Login</StyledLink> | <StyledLink to='/register'>Register</StyledLink></p>
    </div>
  );
}
