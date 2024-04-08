const initialState = {
    date: '',
    question: ''
}

export const questionReducer = (state = initialState, action: any)=>{
    if(action.type == 'question') return { ...action.payload  }

    return state
}

export default questionReducer