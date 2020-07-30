import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
// import ReduxThunk, { ThunkDispatch, ThunkAction } from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import {takeEvery, put} from 'redux-saga/effects'
// import { createStore } from "redux";

import {
  combineReducers,
  configureStore,
  createAction,
  createReducer,
  PayloadAction,
  applyMiddleware,
  Action, createAsyncThunk, getDefaultMiddleware, ActionCreatorWithPayload, ActionCreatorWithOptionalPayload
} from '@reduxjs/toolkit'



export interface SetCountValue {
  value: number,
  multiplier: number
}

export const inc = createAction('INCREMENT');
export const dec = createAction('DECREMENT');
export const setCount = createAction<SetCountValue>('SET_COUNT');
export const asyncRequest = createAction<IUser>('ASYNC_REQUEST');
export const getUser = createAction<number>('GET_USER');
export const updateUser = createAction<IUser>('UPDATE_USER');


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

export const fetchUserActionThunk = createAsyncThunk(  'testing',  fetchUser);



const counterReducer = createReducer(0, builder => {
  builder.addCase(inc, (state, action) => {return state += 1})
    .addCase(dec,
      (state, action) =>
        state + 1
    )
    .addCase(setCount, (state, action) => {
      return action.payload.value * action.payload.multiplier
    })
    .addCase(updateUser, (state, action) => {
      return action.payload.data.id
    })
    .addCase(asyncRequest, (state, action) => {
      return action.payload.data.id;
    })
});

const rootReducer = combineReducers({counter: counterReducer});
export type RootState = ReturnType<typeof rootReducer>

// const store = configureStore({reducer: rootReducer});



let sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware: middleware
});


export function* fetchDataSaga({payload: userId} : PayloadAction<number>) {
  try {
// debugger;
    console.log("fetchDataSaga");
    // const id = 3;
    // const res = yield fetch(`https://reqres.in/api/users/${payload}?delay=1`);
    // const data = yield (res.json()) as IUser;
    const data = yield fetchUser(userId);
    console.log(updateUser(data));
    yield put(updateUser(data)) //calls the store action
  } catch (e) {
    yield put({ type: "TODO_FETCH_FAILED" });
  }
}

const saga = function* rootSaga() {
  yield takeEvery(getUser, fetchDataSaga);
}

sagaMiddleware.run(saga);

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
