import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsNotEmptyString(property?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isNotEmptyString",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return value.trim() !== ''
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = (args.object as any)[relatedPropertyName];
          // return typeof value === "string" &&
          //   typeof relatedValue === "string" &&
          //   value.length > relatedValue.length;
        }
      }
    });
  };
}