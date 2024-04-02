import {
    StyledReactions
} from './postReactionsCSS'
import { useState } from 'react'

export default function PostReactions({ postInfo, selectedReaction, handleReaction }: any){
    const [loading, setLoading] = useState(false)

    const handleInput = async(num: Number)=>{
        setLoading(true)

        await handleReaction(num)

        setLoading(false)
    }

    return <StyledReactions>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="0" checked={selectedReaction === 0} onChange={() => handleInput(0)} />
      😍
      { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 0).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="1" checked={selectedReaction === 1} onChange={() => handleInput(1)} />
      😄
      { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 1).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="2" checked={selectedReaction === 2} onChange={() => handleInput(2)} />
      😂
      { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 2).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="3" checked={selectedReaction === 3} onChange={() => handleInput(3)} />
      😢
      { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 3).length }
    </label>
    <label>
      <input disabled={loading} type="checkbox" name="reaction" value="4" checked={selectedReaction === 4} onChange={() => handleInput(4)} />
      😠
      { postInfo.reactions.filter((reaction: any)=>reaction.reaction == 4).length }
    </label>
  </StyledReactions>
}