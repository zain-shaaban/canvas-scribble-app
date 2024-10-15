import {Request,Response,NextFunction}from 'express'
import ApiError from '../utils/ApiError'
export default function errorHandler(err:ApiError,req:Request,res:Response,next:NextFunction){
    res.status(err.status|500).json({
        status:false,
        message:err.message
    })
}