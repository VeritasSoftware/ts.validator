import { IValidator, IValidationError, IValidationResult, Action, Func, Func2, IRuleSetValidator } from './ivalidator';
import { TypeFactory } from './type-factory';
import { ValidationResult, ValidationError } from './validation-result';

export class ObjectValidator<T> implements IValidator<T> {
    _model: T;
    _validationErrors: ValidationError[];   
    _clonedModel: T;

    constructor(model: T)
    {
        this._model = model;
        this._validationErrors = new Array<ValidationError>();

        this._clonedModel = TypeFactory.getTypeClone(model);      
    }

    For<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IRuleSetValidator<T, TProperty>, IValidationResult>): IValidator<T> {
        var val = predicate(this._model);

        var validator = new RuleSetValidator<T, TProperty>(val, this._model, predicate);

        var errorResult = ruleSet(validator);

        this.addErrors(errorResult.Errors);

        return this;
    }

    ForType<TProperty>(predicate: Func<T, TProperty>, ruleSet: Func<IValidator<TProperty>, IValidationResult>): IValidator<T> {
        var val = predicate(this._model);

        var validator = new ObjectValidator<TProperty>(val);

        var errorResult = ruleSet(validator);

        this.addErrors(errorResult.Errors);

        return this;
    }

    NotNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val == null) {                       
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    }

    IsNull<TProperty>(predicate: Func<T, TProperty>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val != null) {             
            this.processErrors(predicate, val, message, errorIdentifier); 
        }
        return this;
    }

    NotEmpty(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) != null) {            
            this.processErrors(predicate, val, message, errorIdentifier);  
        }
        return this;
    }

    IsEmpty(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null) {                        
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    }

    Length(predicate: Func<T, string>, lowerBound: number, upperBound: number, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (!(val.length >= lowerBound && val.length <= upperBound)) {                        
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    }

    Matches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(regex) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    NotMatches(predicate: Func<T, string>, regex: string, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(regex) != null) {
                this.processErrors(predicate, val, message, errorIdentifier);                
            }            
        }        
        return this;
    }

    CreditCard(predicate: Func<T, number>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {            
            this.processErrors(predicate, val, message, errorIdentifier);                    
        }
        return this;
    }

    Email(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {              
            this.processErrors(predicate, val, message, errorIdentifier);                
        }
        return this;
    }

    If(predicate: Func<T, boolean>, then: Func<IValidator<T>, IValidationResult>): IValidator<T> {
        if (predicate(this._model)) {
            var errorResult = then(new ObjectValidator(this._model));

            this.addErrors(errorResult.Errors);                      
        }

        return this;
    }
    
    ForEach<TArray>(predicate: Func<T, Array<TArray>>, action: Func<IValidator<TArray>, IValidationResult>): IValidator<T>
    {
        var array = predicate(this._model);

        if (array != null && array.length > 0) {
            array.forEach(item => this.addErrors(action(new ObjectValidator(item)).Errors));
        }        

        return this;
    }    

    IsLowercase(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^[a-z]+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsUppercase(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^[A-Z]+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsMixedcase(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    Contains(predicate: Func<T, string>, subString: string, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.indexOf(subString) < 0) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsNumeric(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^\d+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsAlpha(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^[a-zA-Z]+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsAlphaNumeric(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^[a-zA-Z0-9]+$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsGuid(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsBase64(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsUrl(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    IsCountryCode(predicate: Func<T, string>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val.match(/^\s*$/) == null)
        {
            if (val.match(/^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/) == null) {                                
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }        
        return this;
    }

    Required<TProperty>(predicate: Func<T, TProperty>, must: Func2<TProperty, T, boolean>, message: string, errorIdentifier: string = null): IValidator<T> {
        var val = predicate(this._model);

        if (val == null || !must(this._model, val)) {            
            this.processErrors(predicate, val, message, errorIdentifier);   
        }

        return this;
    }

    private getPropertyName(expression: Function): string {
        try{
            return expression(this._clonedModel)();
        }   
        catch(ex) {
            return "";
        }        
    }    
    
    private addErrors(errors: ValidationError[]) {
        if (errors != null &&  errors.length > 0) {
            errors.forEach(e => this._validationErrors.push(e));
        }        
    }

    private processErrors(predicate: Function, val: any, message: string, errorIdentifier: string = null) {
        if (errorIdentifier == null) {
            this._validationErrors.push(new ValidationError(this.getPropertyName(predicate), val, message));  
        }
        else {
            this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
        }   
    }    

    ToResult(): ValidationResult {
        return new ValidationResult(this._validationErrors);
    }
}

class RuleSetValidator<T, TProperty> implements IRuleSetValidator<T, TProperty> {           
    _model: T;
    _clonedModel: T;    
    _validationErrors: ValidationError[];
    _property: TProperty;
    _predicate: Func<T, TProperty>;

    constructor(property: TProperty, model: T, predicate: Func<T, TProperty>)
    {
        this._model = model;
        this._predicate = predicate;
        this._property = property;
        this._validationErrors = new Array<ValidationError>();

        this._clonedModel = TypeFactory.getTypeClone(this._model);  
    }

    NotNull(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property == null) {                       
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsNull(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property != null) {             
            this.processErrors(this._property, message, errorIdentifier); 
        }
        return this;
    }

    NotEmpty(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) != null) {            
            this.processErrors(this._property.toString(), message, errorIdentifier);  
        }
        return this;
    }

    IsEmpty(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null) {                        
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Length(lowerBound: number, upperBound: number, message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (!(this._property.toString().length >= lowerBound && this._property.toString().length <= upperBound)) {                        
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Matches(regex: string, message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(regex) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    NotMatches(regex: string, message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(regex) != null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);                
            }            
        }        
        return this;
    }

    CreditCard(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {            
            this.processErrors(this._property, message, errorIdentifier);                    
        }
        return this;
    }

    Email(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {              
            this.processErrors(this._property, message, errorIdentifier);                
        }
        return this;
    }

    IsLowercase(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^[a-z]+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsUppercase(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^[A-Z]+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsMixedcase(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsNumeric(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^\d+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsAlpha(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^[a-zA-Z]+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsAlphaNumeric(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^[a-zA-Z0-9]+$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsGuid(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsBase64(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsUrl(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    IsCountryCode(message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().match(/^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/) == null) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    Contains(subString: string, message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {        
        if (this._property.toString().match(/^\s*$/) == null)
        {
            if (this._property.toString().indexOf(subString) < 0) {                                
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }        
        return this;
    }

    Required(must: Func2<TProperty, T, boolean>, message: string, errorIdentifier: string = null): IRuleSetValidator<T, TProperty> {
        if (this._property == null || !must(this._model, this._property)) {            
            this.processErrors(this._property, message, errorIdentifier);   
        }

        return this;
    }

    ToResult(): ValidationResult {
        return new ValidationResult(this._validationErrors);
    }

    private processErrors(val: any, message: string, errorIdentifier: string = null) {
        if (errorIdentifier == null) {
            this._validationErrors.push(new ValidationError(this.getPropertyName(this._predicate), val, message));  
        }
        else {
            this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
        }   
    }  
    
    private getPropertyName(expression: Function): string {
        try{
            return expression(this._clonedModel)();
        }   
        catch(ex) {
            return "";
        }        
    }  
}