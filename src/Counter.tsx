import React from 'react';
import { useSelector } from "react-redux";
import { RootState, SetCountValue } from "./index";


type CounterProps = {
  counter: number
}

export function Counter({counter: test}: CounterProps){


  return <h1>{test}</h1>

}