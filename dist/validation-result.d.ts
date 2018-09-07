import { IValidationError, IValidationResult } from './ivalidator';
export declare class ValidationResult implements IValidationResult {
    IsValid: boolean;
    Errors: ValidationError[];
    constructor(errors: ValidationError[]);
    Identifier(identifier: string): ValidationError;
    IdentifierStartsWith(identifier: string): ValidationError[];
}
export declare class ValidationError implements IValidationError {
    Message: string;
    Value: any;
    Identifier: string;
    constructor(identifier: string, value: any, message: string);
}
