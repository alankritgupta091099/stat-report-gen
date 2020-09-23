import { GET_NOTIFICATION , CLEAR_NOTIFICATION } from '../actions/types.js';

const initialState={
    msg:'',
    id:null
}

export default function ( state = initialState , action ){
    switch (action.type) {
        case GET_NOTIFICATION:
            return {
                ...state,
                msg:action.payload.notification,
                id:action.payload.id
            };
        case CLEAR_NOTIFICATION:
            return {
                ...state,
                msg:'',
                id:null
            };
        default:
            return state 
    }
}