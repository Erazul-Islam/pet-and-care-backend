import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../user/user.interface";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import  jwt, { JwtPayload }  from "jsonwebtoken";




const authValidation = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.headers.authorization)

        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You have no token')
        }

        jwt.verify(token, config.jwtAccessSecret as string, function (err, decoded) {
            if (err) {
                throw new AppError(httpStatus.UNAUTHORIZED, 'Token is not varified')
            }

            const role = (decoded as JwtPayload).role

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route')
            }

            req.user = decoded as JwtPayload
            next()

        });
    }
    )

};

export default authValidation;