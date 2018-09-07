import { IValidator, IValidatorSync, IValidatorAsync, Func } from './ivalidator';
import { ValidationResult, ValidationError } from './validation-result';
export declare class Validator<T> implements IValidatorSync<T>, IValidatorAsync<T> {
    _model: T;
    _validationErrors: Array<ValidationError>;
    _basesAsync: Array<BaseRules<any>>;
    constructor(model: T);
    ValidateBase<TBase extends T>(rules: Func<IValidator<TBase>, ValidationResult>): IValidatorSync<T>;
    ValidateBaseAsync<TBase extends T>(rules: Func<IValidator<TBase>, ValidationResult>): IValidatorAsync<T>;
    Validate(rules: Func<IValidator<T>, ValidationResult>): ValidationResult;
    ValidateAsync(rules: Func<IValidator<T>, ValidationResult>): Promise<ValidationResult>;
}
export declare class BaseRules<T> {
    _model: T;
    _rules: Func<IValidator<T>, ValidationResult>;
    constructor(model: T, rules: Func<IValidator<T>, ValidationResult>);
}
