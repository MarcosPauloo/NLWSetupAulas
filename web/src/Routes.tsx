import React from "react";
import {Login} from './components/Login'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
import {ErrorRoute} from "./components/ErrorRoute"

export default function Routes(){
   const router = createBrowserRouter([
    {
        path:"/",
        element:<Login/>,
        errorElement:<ErrorRoute/>
    },
    {
        path:"/inicial",
        element:<div>
                    <Header/>
                    <br/>
                    <SummaryTable/>
                </div>
    }
   ])
   return router
}