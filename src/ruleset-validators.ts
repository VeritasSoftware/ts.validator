import {
    Func, Func2,
    IRuleSetValidatorBase, IDateRuleSetValidator, IStringRuleSetValidator, INumberRuleSetValidator
} from './ivalidator';
import { TypeFactory } from './type-factory';
import { ValidationResult, ValidationError } from './validation-result';

abstract class RuleSetValidatorBase<T, TProperty> implements IRuleSetValidatorBase<T, TProperty> {
    protected _clonedModel: T;
    protected _validationErrors: ValidationError[];
    protected _predicate: Func<T, TProperty>;
    _model: T;
    _property: TProperty;

    constructor(property: TProperty, model: T, predicate: Func<T, TProperty>) {
        this._model = model;
        this._predicate = predicate;
        this._property = property;
        this._validationErrors = new Array<ValidationError>();

        this._clonedModel = TypeFactory.getTypeClone(this._model);
    }

    protected processErrors(val: any, message: string, errorIdentifier: string = null) {
        if (errorIdentifier == null) {
            this._validationErrors.push(new ValidationError(this.getPropertyName(this._predicate), val, message));
        }
        else {
            this._validationErrors.push(new ValidationError(errorIdentifier, val, message));
        }
    }

    protected getPropertyName(expression: Function): string {
        try {
            return expression(this._clonedModel)();
        }
        catch (ex) {
            return "";
        }
    }

    ToResult(): ValidationResult {
        return new ValidationResult(this._validationErrors);
    }
}

export class StringRuleSetValidator<T> extends RuleSetValidatorBase<T, string> implements IStringRuleSetValidator<T> {

    constructor(property: string, model: T, predicate: Func<T, string>) {
        super(property, model, predicate);
    }

    NotNull(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if (this._property == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsNull(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if (this._property != null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    NotEmpty(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) != null) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsEmpty(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Matches(regex: string, message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(regex) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    NotMatches(regex: string, message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(regex) != null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    Length(lowerBound: number, upperBound: number, message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && !(this._property.toString().length >= lowerBound && this._property.toString().length <= upperBound)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Email(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsLowercase(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[a-z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsUppercase(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[A-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsMixedcase(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsNumeric(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^\d+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsAlpha(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[a-zA-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsAlphaNumeric(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(?=.*?[a-zA-Z])(?=.*?\d)[a-zA-Z0-9]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsGuid(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsBase64(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsUrl(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    IsCountryCode(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    Contains(subString: string, message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().indexOf(subString) < 0) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    }

    CreditCard(message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if ((this._property != null) && this._property.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Required(must: Func2<string, T, boolean>, message: string, errorIdentifier: string = null): IStringRuleSetValidator<T> {
        if (this._property == null || !must(this._model, this._property)) {
            this.processErrors(this._property, message, errorIdentifier);
        }

        return this;
    }
}

export class NumberRuleSetValidator<T> extends RuleSetValidatorBase<T, Number> implements INumberRuleSetValidator<T> {

    constructor(property: Number, model: T, predicate: Func<T, Number>) {
        super(property, model, predicate);
    }

    NotNull(message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsNull(message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property != null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsNumberEqual(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property != number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsNumberNotEqual(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property == number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsNumberLessThan(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property >= number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsNumberLessThanOrEqual(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property > number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsNumberGreaterThan(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property <= number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsNumberGreaterThanOrEqual(number: Number, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property < number) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Required(must: Func2<Number, T, boolean>, message: string, errorIdentifier: string = null): INumberRuleSetValidator<T> {
        if (this._property == null || !must(this._model, this._property)) {
            this.processErrors(this._property, message, errorIdentifier);
        }

        return this;
    }
}

export class DateRuleSetValidator<T> extends RuleSetValidatorBase<T, Date> implements IDateRuleSetValidator<T> {

    constructor(property: Date, model: T, predicate: Func<T, Date>) {
        property.setHours(0, 0, 0, 0);

        super(property, model, predicate);
    }

    NotNull(message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        if (this._property == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsNull(message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        if (this._property != null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    }

    IsDateOn(date: Date, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        date.setHours(0, 0, 0, 0);
        this._property.setHours(0, 0, 0, 0);
        if ((this._property != null) && !(this._property.getFullYear() == date.getFullYear() && this._property.getMonth() == date.getMonth() && this._property.getDate() == date.getDate())) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateAfter(date: Date, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        date.setHours(0, 0, 0, 0);
        if ((this._property != null) && (this._property <= date)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateOnOrAfter(date: Date, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        date.setHours(0, 0, 0, 0);
        if ((this._property != null) && (this._property < date)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateBefore(date: Date, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        date.setHours(0, 0, 0, 0);
        if ((this._property != null) && (this._property >= date)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateOnOrBefore(date: Date, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        date.setHours(0, 0, 0, 0);
        if ((this._property != null) && (this._property > date)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateBetween(startDate: Date, endDate: Date, inclusive: boolean, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        if (!(inclusive ? startDate <= this._property && this._property <= endDate : startDate < this._property && this._property < endDate)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    IsDateLeapYear(message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        var year = this._property.getFullYear();

        if (!(!((year % 4) || (!(year % 100) && year % 400)))) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    }

    Required(must: Func2<Date, T, boolean>, message: string, errorIdentifier: string = null): IDateRuleSetValidator<T> {
        if (this._property == null || !must(this._model, this._property)) {
            this.processErrors(this._property, message, errorIdentifier);
        }

        return this;
    }
}