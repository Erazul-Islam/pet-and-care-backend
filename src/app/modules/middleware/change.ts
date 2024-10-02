import jwt, { JwtHeader } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Authorization token missing or invalid'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtAccessSecret as string);
        req.user = decoded as JwtHeader; 
        next();
    } catch  {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
    }
};

export default verifyToken; 
