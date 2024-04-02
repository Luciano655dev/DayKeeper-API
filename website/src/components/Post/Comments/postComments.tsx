import {
    StyledCommentSection,
    StyledLabel,
    StyledInput,
    StyledGifPreview,
    StyledButton,
    StyledComment,
    StyledLink,
    StyledGif,
    StyledGifArea
} from './postCommentsCSS'
import { useState } from "react"
import { useSelector } from 'react-redux'
import PostGifs from "./Gifs/commentsGifs"

export default function PostComments({ postInfo, handleComment, handleCommentReaction }: any){
    const user = useSelector((state: any) => state.userReducer)
    
    const [selectedGif, setSelectedGif]: any = useState(undefined)
    const [comment, setComment] = useState('')
    const sortedComments = [...postInfo.comments].sort((a: any)=>{
        if(a.user.name == user.name)
          return -1

        return 0
    })

    const [loading, setLoading] = useState(false)
    
    const handleSelectGif = (gif: any) => setSelectedGif(gif)
    const handleRemoveGif = () => setSelectedGif(undefined)

    const handleSendComment = async()=>{
      setLoading(true)

      await handleComment(comment, selectedGif)
      setComment('')

      setLoading(false)
    }

    const handleSendReaction = async(username: String, reactionNumber: Number)=>{
      setLoading(true)

      await handleCommentReaction(username, reactionNumber)

      setLoading(false)
    }

    return <div>
        <StyledLabel>Comment</StyledLabel>

        { postInfo.comments.filter((com: any) => com.user.name == user.name).length == 0 ? 
            <div>
                <StyledGifArea>
                    <PostGifs 
                      handleSelectGif={handleSelectGif}
                      handleRemoveGif={handleRemoveGif}
                    ></PostGifs>
                    {
                        selectedGif ?
                        <StyledGifPreview>
                            <img src={selectedGif.url}></img>
                            <button onClick={handleRemoveGif}>X</button>
                        </StyledGifPreview>
                        :
                        <></>
                    }
                </StyledGifArea>

                <StyledInput
                  disabled={loading}
                  style={{ width: '15em', margin: '10px' }}
                  type='text'
                  placeholder='comment here'
                  onChange={(e)=>setComment(e.target.value)}
                ></StyledInput>

                <StyledButton disabled={loading} onClick={() => handleSendComment()}>Send</StyledButton>
            </div>
          :
          <StyledButton
            disabled={loading}
            style={{ backgroundColor: 'red', margin: '10px', width: '15em' }}
            onClick={() => handleComment()}
          >Delete Comment</StyledButton>
        }

        <StyledCommentSection>
          { sortedComments.map( (com: any) => <StyledComment key={Math.random()}>
            <div>
              <img src={com.user.profile_picture.url}></img>
              <StyledLink to={`/${com.user.name}`}>{com.user.name}</StyledLink>
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
                  disabled={loading}
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 0)).length > 0 }
                  onChange={() => handleSendReaction(com.user.name, 0)}
                />
                😍
                { com.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="1"
                  disabled={loading}
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 1)).length > 0 }
                  onChange={() => handleSendReaction(com.user.name, 1)}
                />
                😄
                { com.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="2"
                  disabled={loading}
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 2)).length > 0 }
                  onChange={() => handleSendReaction(com.user.name, 2)}
                />
                😂
                { com.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="3"
                  disabled={loading}
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 3)).length > 0 }
                  onChange={() => handleSendReaction(com.user.name, 3)}
                />
                😢
                { com.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reaction"
                  value="4"
                  disabled={loading}
                  checked={ com.reactions.filter((reac: any) => (reac.user == user.id) && (reac.reaction == 4)).length > 0 }
                  onChange={() => handleSendReaction(com.user.name, 4)}
                />
                😠
                { com.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
              </label>
            </div>
          </StyledComment> ) }
        </StyledCommentSection>
    </div>
}