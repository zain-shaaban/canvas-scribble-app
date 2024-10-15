import { NextFunction,Request,Response } from "express";

export default function asyncWrapper(fn:Function) {
    return async(req:Request,res:Response,next:NextFunction)=>{
        try {
            await fn(req,res,next)
        } catch (error:any) {
            if(error.code===11000)
                error.message='the email is already exist'
            next(error)
        }
    }
}