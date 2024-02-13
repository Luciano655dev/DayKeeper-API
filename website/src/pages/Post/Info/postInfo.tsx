import { StyledImage } from './postInfoCSS'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function PostInfo() {
  const { title: postTitleFromParams, name: username } = useParams()
  const [postInfo, setPostInfo] = useState({ title: '', data: '', images: [] })
  const [sameUser, setSameUser]= useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const getPostInfo = async () => {
      try {
        const token = Cookies.get('userToken')
        if (!token) return setLoading(false)

        if (postTitleFromParams) {
          const responsePostInfo = await axios.get(`http://localhost:3000/${username}/${postTitleFromParams}`, { headers: { Authorization: `Bearer ${token}` } })
          setPostInfo(responsePostInfo.data.post)

          if(responsePostInfo.status != 200) return setMsg(responsePostInfo.data.msg)

          // set Same user
          const user: any = await axios.get('http://localhost:3000/auth/user', { headers: { Authorization: `Bearer ${token}` } })
          if (responsePostInfo.data.post.user == user.data.user._id) setSameUser(true)
        }

        setLoading(false)
      }catch (error: any) {
        setError(error.response.data.msg)
        setLoading(false)
      }
    };

    getPostInfo()
  }, [postTitleFromParams])

  if (error) return <h1>{error}</h1>
  if (loading || !postInfo) return <h1>...</h1>

  return (
    <div>
      <h3>{msg}</h3>

      { postInfo.images ? postInfo.images.map( (img: any) => <StyledImage src={img.url}></StyledImage> ) : <></> }
      <h2>{postInfo.title}</h2>
      <p>{postInfo.data}</p>
      {sameUser ?
        <Link to={`/editpost/${postInfo.title}`}>Edite seu post aqui</Link> :
        <div></div>
      }
    </div>
  );
}