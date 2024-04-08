import { GlobalStyle, Container, Logo, StyledLink } from './navbarCSS';
import Dropdown from './dropDown';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Navbar() {
  const [token, setToken] = useState('')
  const [loadingToken, setLoadingToken] = useState(true)
  const question = useSelector((state: any) => state.questionReducer)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = Cookies.get('userToken')
    setToken(storedToken || '')
    setLoadingToken(false)
  }, [location])

  const handleLogout = () => {
    Cookies.remove('userToken')
    setToken('')
    navigate('/')
  }

  return (
    <Container>
      <GlobalStyle></GlobalStyle>
      <div className='logoContainer'>
        <Logo>DayKeeper</Logo>
      </div>

      {
        loadingToken ? null : token.length ? <div className='dayInfo'>
          <h1>{question.date}</h1>
          <h2> . {question.question}</h2>
        </div> : <NotLogged></NotLogged>
      }

      <div className='userDiv'>
        {loadingToken ? null : token.length ? (
          <div className='user'>
            <button onClick={()=>navigate('/publish')}>+ CREATE</button>
            <Logged
              token={token}
              handleLogout={handleLogout}
              handleConfig={() => navigate('/profile')}
              handlePost={() => navigate('/publish')}
              handleFollowRequest={()=>navigate('/follow_requests')}
            />
          </div>
        ) : (
          <NotLogged />
        )}
      </div>
    </Container>
  );
}

function Logged({ token, handleLogout, handleConfig, handlePost, handleFollowRequest }: any) {
  const [userInfo, setUserInfo]: any = useState({ name: '', profile_picture: { url: '' } });
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError]: any = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/user', {
          headers: { Authorization: 'Bearer ' + token },
        });

        setUserInfo(response.data.user);
      } catch (error) {
        setError('Error fetching user information');
      } finally {
        setLoadingUser(false);
      }
    };

    getUser();
  }, []);

  if (loadingUser) return null;
  if (error) return <li>{error}</li>;

  const options = [
    {
      text: 'Config',
      func: handleConfig,
    },
    {
      text: 'Post',
      func: handlePost,
    },
    {
      text: 'Log Out',
      func: handleLogout,
    }
  ];
  return (
    <div>
      <Dropdown text={userInfo.name} url={userInfo.profile_picture.url} options={
        userInfo.private ?
          [ ...options, { text: 'Follows', func: handleFollowRequest } ] :
          options
      } />
    </div>
  );
}

function NotLogged() {
  return (
    <div>
      <p><StyledLink to='/login'>Login</StyledLink> | <StyledLink to='/register'>Register</StyledLink></p>
    </div>
  );
}
