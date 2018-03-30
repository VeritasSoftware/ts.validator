import * as cloneDeep from 'lodash/cloneDeep';

import { IValidator, IValidationError, IValidationResult, Action, Func  } from './ivalidator';

export class ValidationResult implements IValidationResult {
    IsValid: boolean;
    Errors: ValidationError[];    

    constructor(errors: ValidationError[]) {
        this.Errors = errors;
        this.IsValid = !(this.Errors == null || this.Errors.length > 0);        
    }

    Identifier<TProperty>(identifier: string) : ValidationError {
        var results = this.Errors.filter(function(obj) { return obj.Identifier == identifier; });

        if (results != null) {
            return results[0];
        }

        return null;
    }

    IdentifierStartsWith<TProperty>(identifier: string) : ValidationError[] {
        var results = this.Errors.filter(function(obj) { return obj.Identifier.startsWith(identifier); });

        if (results != null) {
            return results;
        }

        return null;
    }
}

export class ValidationError implements IValidationError {
    Message: string;
    Value: any;
    Identifier: string;    

    constructor(identifier: string, value: any, message: string) {
        this.Message = message;
        this.Value = value;
        this.Identifier = identifier;
    }
}

export class Validator<T> implements IValidator<T> {
    _model: T;
    _validationErrors: ValidationError[];   
    _clonedModel: T;

    constructor(model: T)
    {
        this._model = model;
        this._validationErrors = new Array<ValidationError>();
        this._clonedModel = cloneDeep(this._model);
        //Object.keys(this._clonedModel).map(k => { this._clonedModel[k] = () => k; });         
        findPropertyPath(this._clonedModel);           
    }

    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val == null) {
            if (errorIdentifier == null) {
                this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
            }
            else {
                this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
            }   
        }
        return this;
    }

    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) != null) {
            if (errorIdentifier == null) {
                this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
            }
            else {
                this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
            }   
        }
        return this;
    }

    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) != null)
        {
            if (val.match(regex) == null) {
                if (errorIdentifier == null) {
                    this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
                }
                else {
                    this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
                }                    
            }
        }        
        return this;
    }

    CreditCard(predicate: Func<T, number>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {
            if (errorIdentifier == null) {
                this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
            }
            else {
                this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
            }                    
        }
        return this;
    }

    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T> {
        if (predicate(this._model)) {
            var errorResult = then(new Validator(this._model));

            if (errorResult != null && errorResult.Errors != null && errorResult.Errors.length > 0) {
                for (var i = 0; i < errorResult.Errors.length; i++) {
                    this._validationErrors.push(errorResult.Errors[i]);
                }
            }            
        }

        return this;
    }    

    getPropertyName(expression: Function): string {
        try{
            return expression(this._clonedModel)();
        }   
        catch(ex) {
            return "";
        }        
    }    
    
    Exec(): ValidationResult {
        return new ValidationResult(this._validationErrors);
    }

    GetError(identifier: string): ValidationError {
        return this._validationErrors.filter(function(obj) { return obj.Identifier == "CreditCard.Number.Invalid"; })[0];
    }
}

function findPropertyPath(obj, path:string = null) {    
    Object.keys(obj).map(k => 
        { 
            var o = obj[k];                 

            if (o && typeof o === "object" && ! Array.isArray(o)) {   // check for null then type object
                findPropertyPath(o, k);
            }
            else {
                var old = k;
                if (path != null)                
                    k = path + "." + k;

                return obj[old] = () => k;               
            }
            //return obj[k] = () => k;                
        });
}