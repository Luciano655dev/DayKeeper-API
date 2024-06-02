import {
    StyledReactions
} from './postReactionsCSS'
import { useState } from 'react'

export default function PostReactions({ postInfo, selectedReaction, handleReaction, loggedUserId }: any){
    const [updatedSelectedReaction, setUpdatedSelectedReaction] = useState(selectedReaction)
    const [updatedPostInfo, setUpdatedPostInfo] = useState(postInfo)
    const [loading, setLoading] = useState(false)

    const handleInput = async(index: Number)=>{
      let newReactions = [...updatedPostInfo.reactions]
      const previousReactionIndex = newReactions.findIndex(reaction => reaction.user === loggedUserId)
  
      let newReacIndex = index
      if (previousReactionIndex !== -1){
        if (newReactions[previousReactionIndex].reaction === index){
          newReacIndex = -1
          newReactions.splice(previousReactionIndex, 1)
        } else {
          newReactions[previousReactionIndex].reaction = index
        }
      }
      else
        newReactions.push({ user: loggedUserId, reaction: index })
  
      setUpdatedPostInfo({ ...updatedPostInfo, reactions: newReactions })
      setUpdatedSelectedReaction(newReacIndex)

      await handleReaction(index, { ...updatedPostInfo, reactions: newReactions }, newReacIndex)
    }

    return <StyledReactions>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="0" checked={updatedSelectedReaction === 0} onChange={() => handleInput(0)} />
      😍
      { updatedPostInfo.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="1" checked={updatedSelectedReaction === 1} onChange={() => handleInput(1)} />
      😄
      { updatedPostInfo.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="2" checked={updatedSelectedReaction === 2} onChange={() => handleInput(2)} />
      😂
      { updatedPostInfo.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="3" checked={updatedSelectedReaction === 3} onChange={() => handleInput(3)} />
      😢
      { updatedPostInfo.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="4" checked={updatedSelectedReaction === 4} onChange={() => handleInput(4)} />
      😠
      { updatedPostInfo.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
    </label>
  </StyledReactions>
}