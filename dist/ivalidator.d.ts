export interface IValidator<T> {
    For<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IRuleSetValidator<T, TProperty>, IValidationResult>): IValidator<T>;
    ForDateProperty(predicate: Func<T, Date>, ruleSet: Func<IDateRuleSetValidator<T>, IValidationResult>): IValidator<T>;
    ForStringProperty(predicate: Func<T, string>, ruleSet: Func<IStringRuleSetValidator<T>, IValidationResult>): IValidator<T>;
    ForNumberProperty(predicate: Func<T, Number>, ruleSet: Func<INumberRuleSetValidator<T>, IValidationResult>): IValidator<T>;
    ForType<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IValidator<TProperty>, IValidationResult>): IValidator<T>;
    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T>;
    ForEach<TArray>(predicate: Func<T, Array<TArray>>, action: Func<IValidator<TArray>, IValidationResult>): IValidator<T>;
    Required<TProperty>(predicate: Func<T, TProperty>, must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IValidator<T>;
    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    IsNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier?: string): IValidator<T>;
    IsLowercase(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsUppercase(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsMixedcase(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Contains(predicate: Func<T, string>, subString: string, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumeric(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsAlpha(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsAlphaNumeric(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsGuid(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsBase64(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsUrl(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsCountryCode(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    NotMatches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier?: string): IValidator<T>;
    Email(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    Length(predicate: Func<T, string>, lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IValidator<T>;
    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsEmpty(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    CreditCard(predicate: Func<T, string>, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateOn(predicate: Func<T, Date>, date: Date, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateAfter(predicate: Func<T, Date>, date: Date, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateOnOrAfter(predicate: Func<T, Date>, date: Date, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateBefore(predicate: Func<T, Date>, date: Date, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateOnOrBefore(predicate: Func<T, Date>, date: Date, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateBetween(predicate: Func<T, Date>, startDate: Date, endDate: Date, inclusive: boolean, message: string, errorIdentifier?: string): IValidator<T>;
    IsDateLeapYear(predicate: Func<T, Date>, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberEqual(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberNotEqual(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberLessThan(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberLessThanOrEqual(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberGreaterThan(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    IsNumberGreaterThanOrEqual(predicate: Func<T, Number>, number: Number, message: string, errorIdentifier?: string): IValidator<T>;
    ToResult(): IValidationResult;
}
export interface IRuleSetValidatorBase<T, TProperty> {
    ToResult(): IValidationResult;
}
export interface IStringRuleSetValidator<T> extends IRuleSetValidatorBase<T, string> {
    Required(must: Func2<string, T, boolean>, message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    NotNull(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsNull(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsLowercase(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsUppercase(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsMixedcase(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsNumeric(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsAlpha(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsAlphaNumeric(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsGuid(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsBase64(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsUrl(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsCountryCode(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    Matches(regex: string, message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    NotMatches(regex: string, message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    Email(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    Length(lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    NotEmpty(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    IsEmpty(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    Contains(subString: string, message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
    CreditCard(message: string, errorIdentifier?: string): IStringRuleSetValidator<T>;
}
export interface IDateRuleSetValidator<T> extends IRuleSetValidatorBase<T, Date> {
    Required(must: Func2<Date, T, boolean>, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    NotNull(message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsNull(message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateOn(date: Date, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateAfter(date: Date, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateOnOrAfter(date: Date, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateBefore(date: Date, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateOnOrBefore(date: Date, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateBetween(startDate: Date, endDate: Date, inclusive: boolean, message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
    IsDateLeapYear(message: string, errorIdentifier?: string): IDateRuleSetValidator<T>;
}
export interface INumberRuleSetValidator<T> extends IRuleSetValidatorBase<T, Number> {
    Required(must: Func2<Number, T, boolean>, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    NotNull(message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNull(message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberEqual(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberNotEqual(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberLessThan(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberLessThanOrEqual(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberGreaterThan(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
    IsNumberGreaterThanOrEqual(number: Number, message: string, errorIdentifier?: string): INumberRuleSetValidator<T>;
}
export interface IRuleSetValidator<T, TProperty> {
    Required(must: Func2<TProperty, T, boolean>, message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    NotNull(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsNull(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    CreditCard(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsLowercase(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsUppercase(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsMixedcase(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsNumeric(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsAlpha(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsAlphaNumeric(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsGuid(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsBase64(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsUrl(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsCountryCode(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    Matches(regex: string, message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    NotMatches(regex: string, message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    Email(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    Length(lowerBound: number, upperBound: number, message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    NotEmpty(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    IsEmpty(message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    Contains(subString: string, message: string, errorIdentifier?: string): IRuleSetValidator<T, TProperty>;
    ToResult(): IValidationResult;
}
export interface IValidatorSync<T> {
    ValidateBase<TBase extends T>(rules: Func<IValidator<TBase>, IValidationResult>): IValidatorSync<T>;
    Validate(action: Func<IValidator<T>, IValidationResult>): IValidationResult;
}
export interface IValidatorAsync<T> {
    ValidateBaseAsync<TBase extends T>(rules: Func<IValidator<TBase>, IValidationResult>): IValidatorAsync<T>;
    ValidateAsync(action: Func<IValidator<T>, IValidationResult>): Promise<IValidationResult>;
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
    IdentifierStartsWith(identifier: string): IValidationError[];
}
