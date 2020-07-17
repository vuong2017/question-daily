import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { errorMessages } from '../constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log('exception', exception);
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (exception && exception.name === 'ValidationError') {
            const errors = {};
            for (const key of Object.keys(exception.errors)) {
                errors[key] = (exception.errors[key] || {}).message;
            }
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                message: errorMessages.MESSAGE_VALIDATE,
                errors,
            });
        }
        if (exception && exception.name === 'CastError' || exception.status === HttpStatus.NOT_FOUND) {
            return res.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: errorMessages.NOT_FOUND(exception.value || exception.response.message),
            });
        }
        if (exception && exception.status === HttpStatus.BAD_REQUEST) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(this.buildError(exception.response.message));
        }
        return res.status(exception.status || HttpStatus.INTERNAL_SERVER_ERROR).json(exception.response);

    }

    private buildError(errors) {
        const errorMessage = {};
        if (Array.isArray(errors)) {
            errors.forEach(x => {
                Object.keys(x.constraints).map(rule => {
                    errorMessage[x.property] = [
                        x.constraints[rule],
                    ];
                });
            });
        }
        return {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: errorMessages.MESSAGE_VALIDATE,
            errors: Object.keys(errorMessage).length ? errorMessage : errors,
        };
    }
}
