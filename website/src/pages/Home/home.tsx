import { useSelector } from "react-redux"

function Home(){
    const question = useSelector((state: any) => state.questionReducer)
    console.log(question)
    return <div>
        <h1>HOME UHUUUUU</h1>
    </div>
}

export default Home