import './styles/global.css'
import {Header} from './components/Header'
import './lib/dayjs'
//import { Habit } from "./components/Habit";
import { SummaryTable } from './components/SummaryTable';
import { api } from './lib/axios';
import { Login } from './components/Login';
import {RouterProvider} from 'react-router-dom'
import Routes from './Routes'

Notification.requestPermission(function(result){
  if(result==='granted'){
    navigator.serviceWorker.register('service-worker.js').then(async serviceWorker=>{
      let subscription = await serviceWorker.pushManager.getSubscription()

      if(!subscription){
        const publicKeyResponse = await api.get('/push/public_key')

        subscription = await serviceWorker.pushManager.subscribe({
          userVisibleOnly:true,
          applicationServerKey: publicKeyResponse.data.publicKey,
        })
      }
      
      await api.post('/push/register',{
        subscription,
      })

      await api.post('/push/send',{
        subscription,
      })
    })
  }
  else{
    console.log('sem permissao para mostrar as notificações')
  }
})

export function App() {
  const route = Routes()
  console.log(route)
  return (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className='w-full max-w-5xl px-6 flex flex-col gap-16'>
          <RouterProvider router={route}/>
        </div>
    </div>
    
  )
}

