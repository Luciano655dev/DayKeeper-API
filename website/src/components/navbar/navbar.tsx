import { Container, Logo, List, StyledLink } from './navbarCSS'
import Dropdown from './dropDown';
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function Navbar() {
    const [token, setToken] = useState('')
    const navigate = useNavigate()
  
    useEffect(() => {
      const storedToken = Cookies.get('userToken')

      setToken(storedToken || '')
    }, [useLocation(), token])
  
    const handleLogout = () => {
      Cookies.remove('userToken')
      setToken('')
      navigate('/')
    }
  
    return (
      <Container>
        <Logo>Daykeeper</Logo>

        <List>
          <li>
            <StyledLink to='/'>Home</StyledLink>
          </li>
          <li>
            <StyledLink to='/about'>About Us</StyledLink>
          </li>
          <li>
            <StyledLink to='/posts'>Posts</StyledLink>
          </li>
          {token.length ? 
            <Logged token={token} handleLogout={handleLogout} handleConfig={()=>navigate('/profile')} handlePost={()=>navigate('/createpost')} /> : 
            <NotLogged />
          }
        </List>
      </Container>
    );
  }

function Logged({ token, handleLogout, handleConfig, handlePost }: any) {
  const [userInfo, setUserInfo] = useState({ name: '', profile_picture: { url: '' } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/user', {
          headers: { Authorization: 'Bearer ' + token },
        });

        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);

        setError('...') // Loading aqui
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [token])

  if (loading) return null
  if (error) return <li>{error}</li>

  const options = [
    {
      text: 'Config',
      func: handleConfig
    },
    {
      text: 'Post',
      func: handlePost
    },
    {
      text: 'Log Out',
      func: handleLogout
    }
  ]
  return (
    <li>
      <Dropdown text={userInfo.name} url={userInfo.profile_picture.url} options={options} />
    </li>
  );
}

function NotLogged(){
    return <div>
        <p>( <StyledLink to='/login'>Login</StyledLink>, <StyledLink to='/register'>Register</StyledLink> )</p>
    </div>
}