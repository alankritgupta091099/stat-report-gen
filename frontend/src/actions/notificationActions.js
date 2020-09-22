import { GET_NOTIFICATION , CLEAR_NOTIFICATION } from "./types.js";

export const returnNotifications = ( notification , id ) => {
    return {
        type:GET_NOTIFICATION,
        payload:{ notification , id }
    };
};

export const clearNotifications = () => {
    return {
        type:CLEAR_NOTIFICATION
    }
}