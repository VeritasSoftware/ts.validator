import * as cloneDeep from 'lodash/cloneDeep';

import { IValidator, IValidationError, Action, Func  } from './ivalidator';

export class ValidationError implements IValidationError {
    Message: string;
    Value: any;
    Property: string;

    constructor(property: string, value: any, message: string) {
        this.Message = message;
        this.Value = value;
        this.Property = property;
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
        Object.keys(this._clonedModel).map(k => { this._clonedModel[k] = () => k; });
    }

    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string): IValidator<T> {
        var val = predicate(this._model);

        if (val == null) {
            this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));
        }
        return this;
    }

    NotEmpty(predicate: Func<T, string>, message: string): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) != null) {
            this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));
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
        return expression(this._clonedModel)();
    }

    Exec(): ValidationError[] {
        return this._validationErrors;
    }
}

