import { useState } from 'react'
import InfoPage from './Info/postInfo'
import EditPage from './Edit/editPost'

export default function PostInfo() {
    const [editing, setEditing] = useState(false)

    const togglePage = () => setEditing(!editing)

    return (
        <div>
            { !editing ?
                <InfoPage togglePage={togglePage}></InfoPage>
                :
                <EditPage togglePage={togglePage}></EditPage>
            }
        </div>
    )
}