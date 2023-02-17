import Fastify from "fastify";
import cors from '@fastify/cors' //é u  m mode de segurança onde diz quem pode acessar os dados do meu back-end
import { appRoutes } from "./routes";
import { notificationRoutes } from "./notification-routes";

const app = Fastify();

app.register(cors) //qualquer aplicação pode acessar os dados do meu back-end
app.register(appRoutes)
app.register(notificationRoutes)

app.listen({
    port:3333,
    host: '0.0.0.0'
}).then(()=>{
    console.log('HTTP Server running!')
})