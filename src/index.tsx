import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import ReduxThunk, { ThunkDispatch, ThunkAction } from 'redux-thunk';

// import { createStore } from "redux";

import {
  combineReducers,
  configureStore,
  createAction,
  createReducer,
  PayloadAction,
  applyMiddleware,
  Action, createAsyncThunk
} from '@reduxjs/toolkit'



export interface SetCountValue {
  value: number,
  multiplier: number
}

export const inc = createAction('INCREMENT');
export const dec = createAction('DECREMENT');
export const setCount = createAction<SetCountValue>('SET_COUNT');
export const asyncRequest = createAction<IUser>('ASYNC_REQUEST');

export interface IUser {
  data: {
    id: number
  }
}

//could be in a service or something
const fetchUser = async (id :number) => {
  const res = await fetch(`https://reqres.in/api/users/${id}?delay=1`);
  const data = await (res.json()) as IUser;
  return data;
};

export const fetchUserAction = createAsyncThunk(  'testing',  fetchUser);



const counterReducer = createReducer(0, builder => {
  builder.addCase(inc, (state, action) => {return state += 1})
    .addCase(dec,
      (state, action) =>
        state + 1
    )
    .addCase(setCount, (state, action) => {
      return action.payload.value * action.payload.multiplier
    })
    .addCase(fetchUserAction.fulfilled, (state, action) => {
      return action.payload.data.id
    })
    .addCase(asyncRequest, (state, action) => {
      return action.payload.data.id;
    })
});

const rootReducer = combineReducers({counter: counterReducer});
export type RootState = ReturnType<typeof rootReducer>

const store = configureStore({reducer: rootReducer});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
