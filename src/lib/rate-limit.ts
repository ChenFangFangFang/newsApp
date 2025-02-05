import {prisma} from './prisma';
import  ms from 'ms';
type DurationString = `${number} ${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

class RateLimit{
    async check(identifier: string, limit:number,duration:DurationString){
        const now = new Date()
        const durationInMs = ms(duration ) as number; // This converts strings like '1h' to milliseconds
        const windowStart = new Date(now.getTime() - durationInMs);
        const requestCount = await prisma.rateLimitRequest.count({
            where:{
                identifier,
                createdAt:{
                    gte:windowStart
                }
            }
        })   
        if (requestCount >= limit){
            return {success:false}
        }     
        await prisma.rateLimitRequest.create({
            data:{
                identifier,
            }
        })
        return {success:true}
    }
}

export const rateLimit = new RateLimit()