import {
  StyledFile,
  StyledButton,
  Alert,
  StyledUserContainer,
  StyledLink
} from './postInfoCSS'
import PostComments from '../../../../components/Post/Comments/postComments'
import PostReactions from '../../../../components/Post/Reactions/postReactions';
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
    files: [],
    reactions: [],
    comments: []
  })
  const [sameUser, setSameUser] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const getPostInfo = async () => {
      try {
        if (!postTitleFromParams) return

        const responsePostInfo = await axios.get(`http://localhost:3000/${username}/${postTitleFromParams}?populate=comments.user`,
          { headers: { Authorization: `Bearer ${token}` }
        })
        setPostInfo(responsePostInfo.data.post)

        // update selected reaction
        responsePostInfo.data.post.reactions.filter((reac: any)=>
          reac.user == user.id ? setSelectedReaction(reac.reaction) : reac
        )

        // set Same user
        if (responsePostInfo.data.post.user._id == user.id) setSameUser(true)

        setLoading(false)
      }catch (error: any) {
        return setError(error.response.data.message)
      }
    };

    getPostInfo()
  }, [])

  // ========== REACTION FUNCTION ==========
  const handleReaction = async (index: number, updatedPostInfo: any, newReactionIndex: any) => {
    try{
      await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/react`, {
        reaction: index
      }, { headers: { Authorization: `Bearer ${token}` } })

      setPostInfo(updatedPostInfo)
      setSelectedReaction(newReactionIndex)
    }catch(error){
      console.log(error)
      setPostInfo(postInfo)
    }
  }

  // ========== COMMENT FUNCTIONS ==========
  const handleComment = async(comment: String, selectedGif: any)=>{
    try {
      const response: any = await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/comment`, {
        comment: comment || 'a',
        gif: selectedGif ? selectedGif.id : undefined
      }, { headers: { Authorization: `Bearer ${token}` } })

      setPostInfo({...postInfo, comments: response.data.post.comments})

      setMsg(response.data.msg)
    } catch (error: any) {
      console.log(error)
      setError(error)
    }
  }

  const handleCommentReaction = async(usercomment: String, reaction: Number)=>{
    try{
      const response = await axios.post(`http://localhost:3000/${username}/${postTitleFromParams}/reactcomment/${usercomment}`, {
        reaction
      }, { headers: { Authorization: `Bearer ${token}` } })
      setPostInfo({...postInfo, comments: response.data.post.comments})

      setMsg(response.data.msg)
    } catch (error: any) {
      setError(error.response.data.message)
    }
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

      <h2>{postInfo.title}</h2>

      {
        postInfo.files ?
          postInfo.files.map( (img: any) => <StyledFile data={img.url} key={Math.random()}></StyledFile> )
        :
          <></>
      }
      
      <p>{postInfo.data}</p>

      <div>
        <PostReactions
          postInfo={postInfo}
          selectedReaction={selectedReaction}
          handleReaction={handleReaction}
          loggedUserId={user._id}
        ></PostReactions>

        { sameUser ? <div>
          <br></br><br></br>
            <StyledButton onClick={togglePage}>Edite seu post aqui</StyledButton>
          <br></br><br></br>
        </div> : <></> }

        <PostComments
          postInfo={postInfo}
          handleComment={handleComment}
          handleCommentReaction={handleCommentReaction}
        ></PostComments>
      </div>
    </div>
  )
}