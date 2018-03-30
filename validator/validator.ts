import * as cloneDeep from 'lodash/cloneDeep';

import { IValidator, IValidationError, Action, Func  } from './ivalidator';

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

        if (val.match(regex) == null) {
            if (errorIdentifier == null) {
                this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
            }
            else {
                this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
            }                    
        }
        return this;
    }

    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, ValidationError[]>): IValidator<T> {
        if (predicate(this._model)) {
            var errors = then(new Validator(this._model));

            if (errors.length > 0) {
                for (var i = 0; i < errors.length; i++) {
                    this._validationErrors.push(errors[i]);
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
    
    Exec(): ValidationError[] {
        return this._validationErrors;
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