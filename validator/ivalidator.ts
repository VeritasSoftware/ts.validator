export interface IValidator<T> {
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationError[]>): IValidator<T>;
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string): IValidator<T>;    
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
    Property: string;
}