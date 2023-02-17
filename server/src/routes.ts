import { FastifyInstance } from 'fastify';
import { prisma } from "./lib/prisma";
import { z } from  'zod'; //biblioteca para fazer a validação dos campos title e weekdays
import dayjs from 'dayjs';

export async function appRoutes(app:FastifyInstance){
    app.post('/habits', async (request)=>{
        const createHabitBody = z.object({
            title: z.string(),  //afirmando que é uma string
            weekDays: z.array(  //dizendo que weekdays vai ser uma array compostas por numeros de 0 a 6
                z.number().min(0).max(6)
            )
        })

        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()  //utilizando a biblioteca days, facilita para zerar as horas do objeto date para que possa contar a tarefa com o dia todo e nao a partir daquele horario

        await prisma.habit.create({
            data:{
                title,
                created_at: today,
                weekDays:{
                    create:weekDays.map(weekDay=>{
                        return{
                            week_day:weekDay,   
                        }
                    })
                }
            }
        })
    });

    app.get('/day', async (request)=>{
        const getDayParams =z.object({
            date: z.coerce.date()  //função coerce transforma a string em objetio Date()
        })

        const {date} = getDayParams.parse(request.query)

        const parseDate = dayjs(date).startOf('day')
        const weekDay = parseDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where:{
                created_at:{
                    lte: date, //menor ou igual a data que to passando
                },
                weekDays:{
                    some:{
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where:{
                date: parseDate.toDate()
            },
            include:{
                dayHabits: true,
            }
        })

        const completeHabits = day?.dayHabits.map(dayHabit =>{
            return dayHabit.habit_id
        }) ?? []

        return {
            possibleHabits,
            completeHabits,
        }
    });

    app.patch('/habits/:id/toggle', async (request)=>{
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where:{
                date: today
            }
        })

        if(!day){
            day = await prisma.day.create({
                data:{
                    date: today
                }
            })
        }

        //busca se existe a relacao com o habito x com o dia y (se existir é porque está completo)
        const dayHabit = await prisma.dayHabit.findUnique({
            where:{
                day_id_habit_id:{
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })
        //se está completo - desmarque (delete a relação)
        if(dayHabit){
            await prisma.dayHabit.delete({
                where:{
                    id: dayHabit.id,
                }
            })
        }else{  //se nao está completo - marque (crie a relação)
            await prisma.dayHabit.create({
                data:{
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }
        
    })

    app.get('/summary', async ()=>{
        const summary = await prisma.$queryRaw`
            SELECT
                D.id, 
                D.date, 
                (
                    SELECT
                       cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H
                        ON H.id = HWD.habit_id
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM day D
        `
        return summary  
    })
}

