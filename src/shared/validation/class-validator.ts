import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Required(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: 'required',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: { message: '$property should not be empty', ...validationOptions },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return /\S/.test(value);
                },
            },
        });
    };
}
