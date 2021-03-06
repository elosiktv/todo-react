const initState = {
    avatarUpdated: null,
    backgroundUpdated: null,
    passwordChange: null,
    passwordChangeError: null,
    passwordChangeErrorMessage: null,
    userMessage: null
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case 'AVATAR_SUCCESS':
            return {
                ...state,
                userMessage: 'Profile has been updated',
                avatarUpdated: Date.now().toString(36) + Math.random().toString(36).substr(2)
            }
        case 'BACKGROUND_SUCCESS':
            return {
                ...state,
                userMessage: 'Profile has been updated',
                backgroundUpdated: Date.now().toString(36) + Math.random().toString(36).substr(2)
            }
        case 'PASSWORD_SUCCESS':
            return {
                ...state,
                passwordChangeErrorMessage: null,
                userMessage: 'Profile has been updated',
                passwordChange: Date.now().toString(36) + Math.random().toString(36).substr(2)
            }
        case 'PASSWORD_ERROR':
            return {
                ...state,
                passwordChangeError: Date.now().toString(36) + Math.random().toString(36).substr(2),
                passwordChangeErrorMessage: action.err.message
            }
        default: return state;
    }
}

export default userReducer;