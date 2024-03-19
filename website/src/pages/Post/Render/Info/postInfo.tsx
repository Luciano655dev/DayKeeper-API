import {
  StyledImage,
  StyledCommentSection,
  StyledComment,
  StyledInput,
  StyledButton,
  Alert,
  StyledLabel,
  StyledReactions,
  StyledUserContainer,
  StyledLink,
  StyledGif
} from './postInfoCSS'
import Page404 from "../../../404/Page404";
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

export default function PostInfo({ togglePage }: any) {
  const token = Cookies.get('userToken')
  const user = useSelector((state: any) => state.userReducer)
  const { title: postTitleFromParams, name: username } = useParams()
  const [selectedReaction, setSelectedReaction] = useState(5)
  const [postInfo, setPostInfo]: any = useState({
    title: '',
    data: '',
    images: [],
    reactions: [],
    comments: []
  })
  const [sameUser, setSameUser] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const getPostInfo = async () => {
      try {
        if (!postTitleFromParams) return

        const responsePostInfo = await axios.get(`http://localhost:3000/${username}/${postTitleFromParams}`,
          { headers: { Authorization: `Bearer ${token}` }
        })
        setPostInfo(responsePostInfo.data.post)

        // update selected reaction
        responsePostInfo.data.post.reactions.filter((reac: any)=>
          reac.user._id == user.id ? setSelectedReaction(reac.reaction) : reac
        )

        // set Same user
        if (responsePostInfo.data.post.user._id == user.id) setSameUser(true)

        setLoading(false)
      }catch (error: any) {
        console.log(error)
        return setError(error.response.data.msg)
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
        comment: comment || 'a'
      }, { headers: { Authorization: `Bearer ${token}` } })
      setPostInfo({...postInfo, comments: response.data.post.comments})
      setComment('')

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
      setPostInfo({...postInfo, comments: response.data.post.comments})

      setMsg(response.data.msg)
    } catch (error: any) {
      setError(error.response.data.msg)
    }
    setLoading(false)
  }

  if (error) return <Page404></Page404>
  if (loading || !postInfo) return <h1>...</h1>

  return (
    <div>
      { msg ? <Alert style={{ backgroundColor: 'green' }} msg={msg}></Alert> : <></> }

      <StyledUserContainer>
        <img src={postInfo.user.profile_picture.url}></img>
        <StyledLink to={`/${postInfo.user.name}`}>{postInfo.user.name}</StyledLink>
      </StyledUserContainer>

      { postInfo.images ? postInfo.images.map( (img: any) => <StyledImage src={img.url} key={Math.random()}></StyledImage> ) : <></> }
      <h2>{postInfo.title}</h2>
      <p>{postInfo.data}</p>

      <div>
        <StyledReactions>
          <label>
            <input type="checkbox" name="reaction" value="0" checked={selectedReaction === 0} onChange={() => handleReaction(0)} />
            😍
            { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
          </label>
          <label>
            <input type="checkbox" name="reaction" value="1" checked={selectedReaction === 1} onChange={() => handleReaction(1)} />
            😄
            { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
          </label>
          <label>
            <input type="checkbox" name="reaction" value="2" checked={selectedReaction === 2} onChange={() => handleReaction(2)} />
            😂
            { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
          </label>
          <label>
            <input type="checkbox" name="reaction" value="3" checked={selectedReaction === 3} onChange={() => handleReaction(3)} />
            😢
            { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
          </label>
          <label>
            <input type="checkbox" name="reaction" value="4" checked={selectedReaction === 4} onChange={() => handleReaction(4)} />
            😠
            { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
          </label>
        </StyledReactions>

        { sameUser ? <div>
          <br></br><br></br>
          <StyledButton onClick={togglePage}>Edite seu post aqui</StyledButton>
          <br></br><br></br>
        </div> : <></> }

        <StyledLabel>Comment</StyledLabel>
        { postInfo.comments.filter((com: any) => com.username == user.name).length == 0 ? 
          <div>
            <StyledInput style={{ width: '15em', margin: '10px' }} type='text' placeholder='comment here' onChange={(e)=>setComment(e.target.value)}></StyledInput>
            <StyledButton onClick={() => handleComment()}>Send</StyledButton>
          </div> :
          <StyledButton style={{ backgroundColor: 'red', margin: '10px', width: '15em' }} onClick={() => handleComment()}>Delete Comment</StyledButton>
        }

        <StyledCommentSection>
          { postInfo.comments.map( (com: any) => <StyledComment key={Math.random()}>
            <div>
              <img src={com.user.profile_picture.url}></img>
              <label><strong>{com.user.name}</strong></label>
            </div>
            <div>
              <p>{com.comment}</p>
            </div>

            { com.gif ? 
              <StyledGif src={com.gif.url}/> : 
              <></>
            }

            <div>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="0"
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 0)).length > 0 }
                  onChange={() => handleCommentReaction(com.user.name, 0)}
                />
                😍
                { com.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction" value="1"
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 1)).length > 0 }
                  onChange={() => handleCommentReaction(com.user.name, 1)}
                />
                😄
                { com.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="2"
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 2)).length > 0 }
                  onChange={() => handleCommentReaction(com.user.name, 2)}
                />
                😂
                { com.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="3"
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 3)).length > 0 }
                  onChange={() => handleCommentReaction(com.user.name, 3)}
                />
                😢
                { com.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="4"
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 4)).length > 0 }
                  onChange={() => handleCommentReaction(com.user.name, 4)}
                />
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