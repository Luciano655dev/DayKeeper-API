import { useSelector } from "react-redux"

function Home(){
    const user = useSelector((state: any) => state.userReducer)
    console.log(user)
    return <div>
        <h1>HOME UHUUUUU</h1>
    </div>
}

export default Home