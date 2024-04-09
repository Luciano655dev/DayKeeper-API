import {
  GlobalStyle,
  Container,
  Logo,
  StyledLink,
  Sidebar,
  SidebarArea
} from './navbarCSS';
import Dropdown from './dropDown';
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
              <button onClick={()=>navigate('/publish')}>+ CREATE</button>
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
          <h1>Home</h1>
          <button onClick={()=>navigate('/')}>
            <img src='data:image/png;base64,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'></img>
          </button>
          <button onClick={()=>navigate('/search')}>
            <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOMAAADeCAMAAAD4tEcNAAAAflBMVEX///8AAADw8PD8/PzT09Ovr6/5+fnq6urW1tbl5eXa2tqdnZ309PROTk6hoaG/v7/Ly8tVVVU0NDTFxcWBgYFsbGxdXV16enqRkZGXl5dDQ0NnZ2cjIyO3t7c6OjqoqKgaGhoODg6JiYlHR0d0dHQpKSkeHh49PT0UFBQuLi6MfXROAAAKfklEQVR4nOWd6ULyOhCGlWJLoexQXNgKgnj/N3hEPgT1nSSTThY8z3/aDE0ms2VydydLkmaDxaq3eX0Zdrvbbreczp56D/1WkSbCbwpBkjV7k+H8nmL0snloN0KP0p6ktZq+kdJdUXVn/Tz0aC3IHsq1iXxf7Gb9m5q47Sd6dqoYrm5k2uZPIysBT5QPWWgBdKQP3RoCnpgOQkuhIptUtSU88t4LLQlFsxQR8MQmxik7qD9Jv/Ma23YiLuGRWUzfMh86kPDIJJYtszFzJOGRVWjpPlk5lPCDt/A7SfvZrYgfzIqwIj46l/CDQz+ghO13HyJ+ME1DidjzJOEH82YQCQtJs0bPUwARWwevIn44Xt7n64PVOKv1fLeb7w+V1Y/bfkWc8IY3KmedcbOdZ0WaJEnayPJWc/E4VQR6IAuPEqaMpXiYdpoZNc2KrP/IsQP9LcrC2NEfrgych6T5ZLwHTdxL90leGQ3n8MLYurOVoePy4sVKbxuJWC64FljeWZo82Id6bZsMZGPl3yaDqcGzt86/pIGI1cp+FJmBwn52LKRexPeHem8oNvov6XS6atXNusY3PKP/lkMBUSgaOvvtUcbVa+v23xeR1yASzTa2lYuk9TVCOtsnNRZJzYX4nUQTJOpIvuyC+q2ldKBwsFe+z0lsQB2bchA/K9S7pYMQc1P1vr0bt0f5t87Fd5CG6nWlqw1LaTeKK1eVvtlIv+xCQ2WqC2e3OopXOQ1lJ6pFKbpCWooXjSVfBFBYPXPJ9yjUeEvyPRBFnHom9xbFX+kjjqRYKGLJEMW24f4rHqGFfBfS6Antn/sRUTVdhXQ6/S/6S5vRq0VksWTk40WNcA3kFrKVePoL9fRHiaebkmypYQgY5+TW6M5PhZDG5Lp+5IGqXHz3XY5A/tm1g+ekQ+6/eoZKd1Z1Cwmpz+hT35yhNENNxUB9xqnMqHkUVEVsvUgZ8Rn3YUotxi4+JPXQUIUW1C5ZR/8RxTel2KCZFISMNbxlSl2Hq4he4AHt7Z9IKLKQFbRE7MN68RCWqvfd/xrCz7POgBAOh8/Kg98QasfW/cB+47PokNnkWEZLP5KYFq5jVDpe4agsLXPsly6Fh8yG0BJW/npSwWeFrLM8gVfkq82jsI2zlh2vDUS+3uZROBUXQ303zkvY6An8b8Vw6As7QxaTFWtVq1kvTQpLCS3suScoY5hy4J/g8hb+2KABMHIwYAuw1mGXCOBdyGu4UcEODY5ts+Kdw1fsXwdcSGuuPoRT/uBkwBbgycr9AtBP81UhqwcWfDEXZAOGwEKb4xegLc3c2PBkiOWkHhHz2PHGB482iKSIZMDZD15EFM6FWHaODxIYMeT5V7C4MrxbdQF6yiyHIYEWYUzHg2GZGSvgkaInSNUXiABDvyyFAQNDnpOqarIKDZHzBGjJxWMBHIFnhTgPgFtHDCGAC9AQ42gMmLKNw3c8AxUrZ4jQIvd8/FADDOJzdjeYzImrfwYM6nDSFGiyB8odU0C1yFEZKNARSZzjDIypcaxNFEsInMv5CfSMONsb8h4j8jqOwIATx4OswO+7zoZrBSwN4JTUIBldHlazAJrUHHMT/f6vyfh/+I5IxltYjxwZUWjvr+lVFAaIbH+ELi7nvAdyzoIXAnwHBgI4wQ5UvL2LKdRxdzdAMnIqwFBYroopZCXgd8Dwalz+IwzMcfxH6IDGkpg7Ad14ThAZ/klh6+R+AqPcHDceTnaHx1UtgFXgnAdA5yxInTwFTh5yngANJdf9TljAr8AKVUCDN4r6ozNwNfGSrDBCG5NihbsbrwgcFss56pFhBayZ4yUP4QYZUVIHH4LgWWK4Ws7RgC3A4+MpRVxmFc+ChAeUuUdrYL49ngUJh8c1UmBaKBoXEpd1cMuH8KGfWNwr3DWUOzpchBTiZCcCHsDmB5xgZUcksTk8Vfm5fFwyH0cOEvdH4lfz4cL0EF2Jf4OPZVrkR+Fzgp6ZO4MNAJs4vtwpCmnwMrLRh1g/R5D1IDo+2KTyiUeFj87hY5l2YXx8Uje485Hg/95u6ybON4fePoiWFnZVJ0RbhcDHkYgji7YBNXxiNPCKJA5J2+p74qBhsA4IRwhNOLLet4k2DyFvfyEaW9l7toTW2QmOmQnVc7pGWJR4Yrh4ADGz6uhBqvVQqP2DashaZzxFhZ8ZyI+k2sDV04L4NGuotiRUE9h6u1mD+JBBNklq5dTdzKgPKdr61AyytWbd/zulPqT3bGRKNbmvPxKyt7TvoxBkR2YBJU/e6+PX3CGvg5BI4cNiH6k/0Bi6VbnI48m2oGt/JwXoOxJkqk3oBqxLX+VldF9tqfgSfXee+7ttPlHc/iK2Xsj+ro6vffmHQkQ574Dok3XEQ0GLoq22ZN2w4gKGN9eKh9brwhal4oKbndsthPDTTywl/2Cy9ekRl8YAZS//4yD5B6tmjMPUq/7iMsmTp8o/VPBugmtyqlPxNZJZJuWdU0sXi1K5FC8IziLFtQHCbzqRmlyw94lg4jdX31ImfPnTAPZzwgie6ldejXQvGuQpePe8CzrsVAvoM29SxWbsW3u7cjal9t1TCd0zML7v9cK7XAGx/vruTd1l2eRctHthLafZNXbHkUmdtw2sbwiv5KwBAyHvX2xt5b7FLL0gZw2orvP6YrniW8u54pInM+T2aPUFgl9M+xw1kJtekKxEzmXWXbJ55lAuzJZmq0NHGnjIWQM6Y+CK+UQjZ2tFXthjg1xpTW50JfUXw81qkDWK67BIUjTyfmfCe44JcmG0wkLFz7fldPo6m81epy/DpcrprsWbnDVQWwk6QzD4ojNeAyJ3RkN5x2ZYBGMDJjaPCHO9nfwdQY+9Xcv2MmZacLarTySLwj18ysPnzNNEIX4hGUbL7Vwhcyb/NryCOWdEC20XZKZZgOHFhSmY/+ZQMoieOJuw+2+nNpX3CAOWooeLC8WttPZUv8oqeJGs+0o26psxX69n3gOWJ3fGCPeozMnKCxtGKxxp40bspPsbFz0pQ3s7Jr0Hrgkpn28aS+wkE2U4SJE5hzg4IpZ1iDpaQ4YLnQOYM7IER5z0/20/2opZrkyisxnz8Y5K+/Ief9LOFqb7WcoM/wydFWYMzCNRh3LFC8kyY0Ajl61GWotZ91319mpZPo4ttmqm0bF3XNuX5u3F02w6XF7ZtdXuuXyd9MZt6+yIUSj7Cj8dq5O0KBoniiKtvUS41kAMp1PZhLcGPNCseELGcWCcSb7nCRlX1zFDGkqd/Zuo2o6ZkjLjn4J1Ax5hxgYE6wY8wrQGHJdpOoIZGxCsG/AI1xoIeQ7XGq41EL6PgwXMTME8rissDGFmChzV2zqGmSm4ydl6l7CsgZs0eLiZgptckXc8ayCuxscMGNbATbognxiWud1HdzMAB9Myt3iuz7WAPin5g9ADrQO+UPBvyXjXMDncY3ODe0wY1Q1E0rnSHoOCxYjuz7VEn7i/yYjyd7TWQAx9K+uiiQ3crplzjTo2EEvT45qorIF4GnTXhK4buPmN40KDqMj32GfEPfjm9vUfWYxngNs8vMmUh4rxj1jWIa6brGVIHq6qS0a9v7QUr8kWj+V2W25W1+mc/wCyEoYhv07UTwAAAABJRU5ErkJggg=='></img>
          </button>
        </SidebarArea>
        { loading ? null : token.length ? <SidebarArea>
          <Logged
            location={'sidebar'}
            token={token}
            handleLogout={handleLogout}
          />
        </SidebarArea> : <></> }
      </Sidebar>
    </div>
  );
}

function Logged({ token, handleLogout, location }: any) {
  const navigate = useNavigate()
  const [userInfo, setUserInfo]: any = useState({ name: '', profile_picture: { url: '' } })
  const [userFollowing, setUserFollowing]: any = useState({ usersFollowing: [] })
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError]: any = useState(null);

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
        setUserFollowing(followingResponse.data.usersFollowing)
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

  if(location == 'sidebar') return <SidebarArea>
      <h1>Friends</h1>
      { userFollowing.map((user: any)=>
        <button key={user._id} onClick={()=>navigate(`/${user.name}`)}>
          <img src={user.profile_picture.url}></img>
          {user.name}
        </button>
      ) }
    </SidebarArea>
}

function NotLogged() {
  return (
    <div>
      <p><StyledLink to='/login'>Login</StyledLink> | <StyledLink to='/register'>Register</StyledLink></p>
    </div>
  );
}
