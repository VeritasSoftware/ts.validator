import { IValidator, IValidationResult, Func, Func2, IRuleSetValidator } from './ivalidator';
import { ValidationResult, ValidationError } from './validation-result';
export declare class ObjectValidator<T> implements IValidator<T> {
    _model: T;
    _validationErrors: ValidationError[];
    _clonedModel: T;
    constructor(model: T);
    For<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IRuleSetValidator<T, TProperty>, IValidationResult>): IValidator<T>;
    ForType<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IValidator<TProperty>, IValidationResult>): IValidator<T>;
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    IsNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Length(predicate: Func<T, string>, lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IValidator<T>;
    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    NotMatches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    CreditCard(predicate: Func<T, number>, message: string, errorIdentifier?: string): IValidator<T>;
    Email(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T>;
    ForEach<TArray>(predicate: Func<T, Array<TArray>>, action: Func<IValidator<TArray>, IValidationResult>): IValidator<T>;
    Required<TProperty>(predicate: Func<T, TProperty>, must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IValidator<T>;
    private getPropertyName(expression);
    private addErrors(errors);
    private processErrors(predicate, val, message, errorIdentifier?);
    ToResult(): ValidationResult;
}
