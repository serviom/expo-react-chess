import {AuthActionCreators} from "./auth/action-creators";
import {BoardActionCreators} from "./board/action-creators";
import {EventActionCreators} from "./event/action-creators";

export const allActionCreators = {
    ...AuthActionCreators,
    ...BoardActionCreators,
    ...EventActionCreators
}