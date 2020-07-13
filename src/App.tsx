import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useSelector, useDispatch } from "react-redux";
import { asyncRequest, dec, inc, IUser, RootState, setCount, fetchUserAction } from "./index";
import {Counter} from "./Counter"


function App() {

  const counter = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React

        </a>
        <button onClick={ () => {console.log(inc());  dispatch(inc())} } >Increment {counter}</button>
        <button onClick={ () => {console.log(dec());  dispatch(dec())} } >Dec {counter}</button>
        <button onClick={ () => {console.log(setCount({multiplier: 3, value: 2}));  dispatch(setCount({multiplier: 3, value: 2}))} } >Dec {counter}</button>

        <button onClick={
          () => {
            console.log(fetchUserAction.fulfilled({data: {id: 3}}, 'test', 3));
            dispatch(fetchUserAction(6))
          }
        }>Async
        </button>

        <button onClick={
          async () => {
            const res = await fetch('https://reqres.in/api/users/3?delay=1');
            const data = (await res.json()) as IUser;
            dispatch(asyncRequest(data))
          }
        }>Async Manual
        </button>
        <Counter counter={counter}/>
      </header>

    </div>
  );
}

export default App;
// export default connect(null, { inc: {type: "TEST", payload: null}})(App);
