export interface IValidator<T> {
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T>;
    ForEach<TArray>(predicate: Func<T, Array<TArray>>, action: Func<IValidator<TArray>, IValidationResult>): IValidator<T>;
    Required<TProperty>(predicate: Func<T, TProperty>, must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IValidator<T>;
    RequiredAsync<TProperty>(musts: IRequiredAsync<TProperty, T, boolean>[]): IValidator<T>;    
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    IsNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    NotMatches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    CreditCard(predicate: Func<T, number>, message: string, errorIdentifier?: string): IValidator<T>;
    Email(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;   
    Exec(): IValidationResult;
}

export interface Action<T> {
    (item: T): void;
}

export interface Func<T, TResult> {
    (item: T): TResult;
}

export interface Func2<T, TProperty, TResult> {
    (property: TProperty, item: T): TResult;
}

export interface IRequiredAsync<T, TProperty, TResult> {
    predicate: Func<TProperty, T>,
    required: Func2<T, TProperty, TResult>,
    message: string,
    errorIdentifier?: string
}

export interface IValidationError {
    Message: string;
    Value: any;
    Identifier: string;
}

export interface IValidationResult {
    Errors: IValidationError[];
    IsValid: boolean;

    Identifier(identifier: string): IValidationError;
    IdentifierStartsWith(identifier: string) : IValidationError[];
}