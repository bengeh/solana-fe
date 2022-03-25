import { applyMiddleware, combineReducers, createStore } from 'redux';
import { createLogger } from "redux-logger"
import { configureStore } from '@reduxjs/toolkit'
import tweetReducer from "./features/tweets/tweetSlice";
import thunk from "redux-thunk" 

const loggerMiddleware = createLogger()
const rootReducer = combineReducers({
    tweets: tweetReducer
})

export const store = createStore(rootReducer, applyMiddleware(loggerMiddleware, thunk))

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch