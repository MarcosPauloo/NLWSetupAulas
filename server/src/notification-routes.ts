import WebPush from 'web-push'  //api para manipular notificações na web, fazendo com que notifique até com a aplicação fechada
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const publicKey = 'BI18dlS3DInaiurK3ikaVS_okqSgmkmPlfIDWTi6ASEeKwNKGdizEKT6QB3tvWpGDTUSF27B9dx-JTfNIE-TGt4'
const privateKey = 'iN2JcWSPlJLOJk2D8niQw6_HCjxXhXWzARh9MaR2Kd8'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey) //as chaves serao fixas agr

export async function notificationRoutes(app:FastifyInstance){
   app.get('/push/public_key', ()=>{
    return {
        publicKey,
    }
   })

   app.post('/push/register', (request,reply)=>{
        console.log(request.body)

        return reply.status(201).send()
   })

   app.post('/push/send', async (request, reply)=>{
        const sendPushBody = z.object({
            subscription: z.object({
                endpoint: z.string(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string(),
                })
            })
        })

        const {subscription} = sendPushBody.parse(request.body)

        setTimeout(()=>{
            WebPush.sendNotification(subscription, 'Hello do backend')
        }, 5000)

        return reply.status(201).send()
   })
}

