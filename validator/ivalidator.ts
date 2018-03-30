export interface IValidator<T> {
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationError[]>): IValidator<T>;
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>; 
    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;   
    Exec(): IValidationError[];
}

export interface Action<T> {
    (item: T): void;
}

export interface Func<T, TResult> {
    (item: T): TResult;
}

export interface IValidationError {
    Message: string;
    Value: any;
    Identifier: string;
}