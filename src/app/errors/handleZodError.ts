import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "./error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1],
            message: issue.message,
        };
    });

    const statusCode = 400;

    return {
        statusCode,
        message: 'zod validation Error',
        errorSources,
    };
};

export default handleZodError;