import { Check } from "phosphor-react"
import React, { FormEvent, useEffect, useState } from "react"
import {Link, Navigate, RedirectFunction, useNavigate} from "react-router-dom"

export function Login(){
    const navigate= useNavigate();
    const [login,setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        if(!isLoggedIn){
            navigate("/")
        }
        else{
            navigate("/inicial")
        }
    },[navigate, isLoggedIn])

    function fazerLogin(event: FormEvent){
        event.preventDefault()

        if(login==='' || password === ''){
            alert('Falta alguma coisa malandro')
            return
        }
        setIsLoggedIn(true)
        alert('Login realizado com sucesso')
        setLogin('')
        setPassword('')
    }

    function mudarRota(){
        const rota = '/inicial'
        return (
            rota
        )
    }

    return (
        <div className="flex items-center justify-center font-semibold leading-tight ">
            <form onSubmit={fazerLogin} className="w-96 flex flex-col justify-center border-4 rounded-lg border-violet-600 p-4 gap-1 bg-gray-900">
                <div className="flex flex-row justify-center ">
                    <label htmlFor="title" className="text-2xl">Login</label>
                </div>
                <label htmlFor="usuario">Digite o seu login</label>
                <input 
                    type="text" 
                    id="usuario" 
                    className="p-4 rounded-lg mt-2 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    placeholder="Usuário ou email"
                    autoFocus
                    value={login}
                    onChange={event=>setLogin(event.target.value)}
                    />
                <label htmlFor="password" className="mt-2">Digite sua senha</label>
                <input 
                    type="password" 
                    id="password" 
                    placeholder="Senha"
                    className="p-4 rounded-lg mt-2 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    onChange={event=>setPassword(event.target.value)}
                    />
                <button 
                    className="bg-green-600 p-4 mt-2 rounded-lg flex items-center justify-center gap-2 font-bg hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-background"
                    
                    >
                    Login
                    <Check size={20} weight="bold"/>
                </button>
            </form>
        </div>
    )
}