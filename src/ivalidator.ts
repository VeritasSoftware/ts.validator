export interface IValidator<T> {
    For<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IRuleSet<T, TProperty>, IValidationResult>): IValidator<T>;
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T>;
    ForEach<TArray>(predicate: Func<T, Array<TArray>>, action: Func<IValidator<TArray>, IValidationResult>): IValidator<T>;
    Required<TProperty>(predicate: Func<T, TProperty>, must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IValidator<T>;
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    IsNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Length(predicate: Func<T, string>, lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IValidator<T>
    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    NotMatches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    CreditCard(predicate: Func<T, number>, message: string, errorIdentifier?: string): IValidator<T>;
    Email(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;   
    Exec(): IValidationResult;
}

export interface IRuleSet<T, TProperty>{
    Required(must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    NotNull(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    IsNull(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    NotEmpty(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    IsEmpty(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    Length(lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IRuleSet<T, TProperty>
    Matches(regex: string, message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    NotMatches(regex: string, message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    CreditCard(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
    Email(message: string, errorIdentifier?: string): IRuleSet<T, TProperty>;
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