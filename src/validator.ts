import { IValidator, IValidatorSync, IValidatorAsync, IValidationError, IValidationResult, Action, Func, Func2 } from './ivalidator';
import { ObjectValidator } from './object-validator';
import { ValidationResult, ValidationError } from './validation-result';

export class Validator<T> implements IValidatorSync<T>, IValidatorAsync<T> {
    _model: T;
    _validationErrors: Array<ValidationError>;
    _basesAsync: Array<BaseRules<any>>;    

    constructor(model: T)
    {
        this._model = model;   
        this._validationErrors = new Array<ValidationError>();
        this._basesAsync = new Array<BaseRules<any>>();             
    }

    ValidateBase<TBase extends T>(rules: Func<IValidator<TBase>, ValidationResult>): IValidatorSync<T> {
        var base = <TBase>this._model; 

        if (base != null) {
            var validationResult = new Validator<TBase>(base).Validate(rules);
            if (validationResult.Errors.length > 0) {
                validationResult.Errors.forEach(error => this._validationErrors.push(error));
            }
        }

        return this;        
    }

    ValidateBaseAsync<TBase extends T>(rules: Func<IValidator<TBase>, ValidationResult>): IValidatorAsync<T> {
        var base = <TBase>this._model;
        this._basesAsync.push(new BaseRules<TBase>(base, rules));        

        return this;        
    }

    Validate(rules: Func<IValidator<T>, ValidationResult>): ValidationResult {
        return rules(new ObjectValidator<T>(this._model));
    }

    async ValidateAsync(rules: Func<IValidator<T>, ValidationResult>): Promise<ValidationResult> {
        var promise = new Promise<ValidationResult>((resolve, reject) => {

            if (this._basesAsync.length > 0) {
                this._basesAsync.forEach(async base => {
                    var validationResult = base._rules(new ObjectValidator<any>(base._model));
                    if (validationResult.Errors.length > 0) {
                        validationResult.Errors.forEach(error => this._validationErrors.push(error));
                    }
                });                
            }

            var validationResult = rules(new ObjectValidator<T>(this._model));

            if (validationResult.Errors.length > 0) {
                validationResult.Errors.forEach(error => this._validationErrors.push(error));
            }

            resolve(new ValidationResult(this._validationErrors));
        });
        
        return promise;
    }
}

export class BaseRules<T> {
    _model: T;
    _rules: Func<IValidator<T>, ValidationResult>;

    constructor(model: T, rules: Func<IValidator<T>, ValidationResult>) {
        this._model = model;
        this._rules = rules;
    }
}