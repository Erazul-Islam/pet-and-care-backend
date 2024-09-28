import { Response } from 'express';

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
    status:number
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data?.statusCode).json({
        status: data.statusCode,
        success: data.success,
        message: data.message,
        data: data.data,
    });
};

export default sendResponse