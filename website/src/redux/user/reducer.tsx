const initialState = {
    name: '',
    id: '',
    pfp: {
        key: '',
        url: '',
        name: '',
        size: 0
    }
}

export const userReducer = (state = initialState, action: any)=>{
    if(action.type == 'user') return { ...action.payload  }

    return state
}

export default userReducer