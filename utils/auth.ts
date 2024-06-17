import { auth } from '@clerk/nextjs/server';
import { prisma } from "./db"

//this is to get the userId to retrieve the journals of the current user
export const getUserByClerkID = async () => {
    const {userId} = await auth()

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            clerkId : userId, //Getting clerkId from User Schema
        },
    })

    return user
}