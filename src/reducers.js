import { combineReducers } from 'redux'
import { REQUEST_POSTS, RECEIVE_POSTS, SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT } from './actions'

function selectedSubreddit(state = 'reactjs', action) {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

const initialPostsState = {
    isFetching: false,
    didInvalidate: false,
    items: []
}
function posts(state = initialPostsState, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return {
                ...state,
                didInvalidate: true
            }
        case REQUEST_POSTS:
            return {
                ...state,
                isFetching: true,
                didInvalidate: false
            }
        case RECEIVE_POSTS:
            return {
                ...state,
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}


function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case REQUEST_POSTS:
        case RECEIVE_POSTS:
            return {
                ...state,
                [action.subreddit]: posts(state[action.subreddit], action)
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    selectedSubreddit,
    postsBySubreddit
})

export default rootReducer