import { IValidator, IValidationError, IValidationResult  } from './ivalidator';

export class ValidationResult implements IValidationResult {
    IsValid: boolean;
    Errors: ValidationError[];    

    constructor(errors: ValidationError[]) {
        if (errors == null){
            this.Errors = new Array<ValidationError>();
        }
        else {
            this.Errors = errors;
        }        

        this.IsValid = this.Errors.length <= 0;
    }

    Identifier(identifier: string) : ValidationError {
        var results = this.Errors.filter(function(obj) { return obj.Identifier == identifier; });

        if (results != null) {
            return results[0];
        }

        return null;
    }

    IdentifierStartsWith(identifier: string) : ValidationError[] {
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