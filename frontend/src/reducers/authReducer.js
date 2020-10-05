import { 
    USER_LOADING , 
    USER_LOADED , 
    AUTH_ERROR , 
    LOGIN_SUCCESS , 
    LOGIN_FAIL , 
    LOGOUT_SUCCESS , 
    REGISTER_SUCCESS , 
    REGISTER_FAIL  
} from "../actions/types.js";

const initialState={
    token: localStorage.getItem('user-token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}

export default function( state = initialState , action ) {
    switch (action.type) {
        case USER_LOADING:
            return{
                ...state,
                isLoading:true
            };
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('user-token', action.payload.token )
            return{
                ...state,
                token:action.payload.token,
                user:action.payload.user,
                isAuthenticated:true,
                isLoading:false
            };
        case REGISTER_SUCCESS:
        case REGISTER_FAIL:
            return{
                ...state,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('user-token')
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            };
        default:
            return state;
    }
}