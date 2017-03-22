import fetch from 'isomorphic-fetch'

/*
    Actions Types
 */

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'


/*
    Actions Creators
 */

export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}


/*
    Async Action Creators
 */

export function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}

export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

// Use the thunk action creator
export function fetchPosts(subreddit) {

    // dispatch is passed by the thunk middleware
    return function (dispatch) {

        // First dispatch : the app state is inform about the API call
        dispatch(requestPosts(subreddit))

        // then we return a promise
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json =>
                // We update the app state with the result of API call
                dispatch(receivePosts(subreddit, json))
            )
    }
}

// Return boolean information about the validity of posts for a subreddit
function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]

    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {

    // this function receive also the getState from the thunk middleware
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            // dispatch a thunk for thunk
            dispatch(fetchPosts(subreddit))
        } else {
            // nothing to do and no waiting for
            return Promise.resolve()
        }
    }
}