import { StyledImage, StyledCommentSection, StyledComment, StyledInput, StyledButton, Alert, StyledLabel, StyledLink } from './postInfoCSS'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function PostInfo() {
  const token = Cookies.get('userToken')
  const { title: postTitleFromParams, name: username } = useParams()
  const [selectedReaction, setSelectedReaction] = useState(5)
  const [userCommentData, setUserCommentData]: any = useState([])
  const [postInfo, setPostInfo] = useState({
    title: '',
    data: '',
    images: [],
    reactions: [], // cada indice é a lista da reação especifica
    comments: []
  })
  const [sameUser, setSameUser] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState('')

  const updateLocalComments = async(response: any) => {
    try {
      const comments = response.data.post.comments
      const userPromises = comments.map((comment: any) => getUserComment(comment.user))
      const users = await Promise.all(userPromises)

      const userCommentData = users.map((user, index) => ({
        username: user.username,
        pfp: user.pfp,
        comment: comments[index].comment,
        reactions: comments[index].reactions
      }))
    
      setUserCommentData(userCommentData)
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  useEffect(() => {
    const getPostInfo = async () => {
      try {
        if (postTitleFromParams) {
          const responsePostInfo = await axios.get(`http://localhost:3000/${username}/${postTitleFromParams}`, { headers: { Authorization: `Bearer ${token}` } })
          setPostInfo(responsePostInfo.data.post)

          // fill the Data
          await updateLocalComments(responsePostInfo)

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

  
  const handleReaction = async (reaction: number) => {
    setLoading(true)
    try {
      const response: any = await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/react`, {
        reaction
      }, { headers: { Authorization: `Bearer ${token}` } })

      setPostInfo({...postInfo, reactions: response.data.post.reactions})
      setSelectedReaction(selectedReaction === reaction ? 10 : reaction)
      setMsg(response.data.msg)
    } catch (error: any) {
      setError(error.response.data.msg)
    }
    setLoading(false)
  }

  const handleComment = async()=>{
    setLoading(true)

    try {
      const response: any = await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/comment`, {
        comment
      }, { headers: { Authorization: `Bearer ${token}` } })
      setPostInfo({...postInfo, comments: response.data.post.comments})
      setComment('')

      // fill the data of each user
      await updateLocalComments(response)

      setMsg(response.data.msg)
    } catch (error: any) {
      setError(error.response.data.msg)
    }

    setLoading(false)
  }

  const handleCommentReaction = async(usercomment: String, reaction: Number)=>{
    setLoading(true)
    try{
      const response = await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/reactcomment/${usercomment}`, {
        reaction
      }, { headers: { Authorization: `Bearer ${token}` } })

      // fill the data of each user
      await updateLocalComments(response)

      setMsg(response.data.msg)
    } catch (error: any) {
      setError(error.response.data.msg)
    }
    setLoading(false)
  }

  const getUserComment = async(id: String)=>{
    try {
      const response: any = await axios.get(`http://localhost:3000/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      return {
        username: response.data.user.name,
        pfp: response.data.user.profile_picture.url,
      }
    } catch (error: any) {
      console.log(error)
      setMsg(error.response.data.msg)
    }
  }

  if (error) return <h1>{error}</h1>
  if (loading || !postInfo) return <h1>...</h1>

  return (
    <div>
      { msg ? <Alert style={{ backgroundColor: 'green' }} msg={msg}></Alert> : <></> }

      { postInfo.images ? postInfo.images.map( (img: any) => <StyledImage src={img.url}></StyledImage> ) : <></> }
      <h2>{postInfo.title}</h2>
      <p>{postInfo.data}</p>

      <div>
        <label>
          <input type="checkbox" name="reaction" value="0" checked={selectedReaction === 0} onChange={() => handleReaction(0)} />
          😍
          { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
          ❗
        </label>
        <label>
          <input type="checkbox" name="reaction" value="1" checked={selectedReaction === 1} onChange={() => handleReaction(1)} />
          😄
          { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
          ❗
        </label>
        <label>
          <input type="checkbox" name="reaction" value="2" checked={selectedReaction === 2} onChange={() => handleReaction(2)} />
          😂
          { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
          ❗
        </label>
        <label>
          <input type="checkbox" name="reaction" value="3" checked={selectedReaction === 3} onChange={() => handleReaction(3)} />
          😢
          { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
          ❗
        </label>
        <label>
          <input type="checkbox" name="reaction" value="4" checked={selectedReaction === 4} onChange={() => handleReaction(4)} />
          😠
          { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
          ❗
        </label>

        <br></br> <br></br> <br></br>
        { sameUser ? <StyledLink to={`/editpost/${postInfo.title}`}>Edite seu post aqui</StyledLink> : <></> }
        <br></br> <br></br> <br></br>

        <StyledLabel>Comment</StyledLabel>
        <StyledInput style={{ width: '15em', margin: '10px' }} type='text' placeholder='comment here' onChange={(e)=>setComment(e.target.value)}></StyledInput>
        <StyledButton onClick={()=>handleComment()}>Send</StyledButton>

        <StyledCommentSection>
          { userCommentData.map( (com: any) => <StyledComment>
            <div>
              <img src={com.pfp}></img>
              <label><strong>{com.username}</strong></label>
            </div>
            <div>
              <p>{com.comment}</p>
            </div>

            <div>
              <label>
                <input type="checkbox" name="reaction" value="0" checked={selectedReaction === 0} onChange={() => handleCommentReaction(com.username, 0)} />
                😍
                { com.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
              </label>
              <label>
                <input type="checkbox" name="reaction" value="1" checked={selectedReaction === 1} onChange={() => handleCommentReaction(com.username, 1)} />
                😄
                { com.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
              </label>
              <label>
                <input type="checkbox" name="reaction" value="2" checked={selectedReaction === 2} onChange={() => handleCommentReaction(com.username, 2)} />
                😂
                { com.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
              </label>
              <label>
                <input type="checkbox" name="reaction" value="3" checked={selectedReaction === 3} onChange={() => handleCommentReaction(com.username, 3)} />
                😢
                { com.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
              </label>
              <label>
                <input type="checkbox" name="reaction" value="4" checked={selectedReaction === 4} onChange={() => handleCommentReaction(com.username, 4)} />
                😠
                { com.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
              </label>
            </div>
          </StyledComment> ) }
        </StyledCommentSection>
      </div>
    </div>
  )
}