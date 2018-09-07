"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_factory_1 = require("./type-factory");
var validation_result_1 = require("./validation-result");
var ObjectValidator = /** @class */ (function () {
    function ObjectValidator(model) {
        this._model = model;
        this._validationErrors = new Array();
        this._clonedModel = type_factory_1.TypeFactory.getTypeClone(model);
    }
    ObjectValidator.prototype.For = function (predicate, ruleSet) {
        var val = predicate(this._model);
        var validator = new RuleSetValidator(val, this._model, predicate);
        var errorResult = ruleSet(validator);
        this.addErrors(errorResult.Errors);
        return this;
    };
    ObjectValidator.prototype.ForType = function (predicate, ruleSet) {
        var val = predicate(this._model);
        var validator = new ObjectValidator(val);
        var errorResult = ruleSet(validator);
        this.addErrors(errorResult.Errors);
        return this;
    };
    ObjectValidator.prototype.NotNull = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.IsNull = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val != null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.NotEmpty = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) != null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.IsEmpty = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.Length = function (predicate, lowerBound, upperBound, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (!(val.length >= lowerBound && val.length <= upperBound)) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.Matches = function (predicate, regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(regex) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.NotMatches = function (predicate, regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(regex) != null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.CreditCard = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.Email = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.If = function (predicate, then) {
        if (predicate(this._model)) {
            var errorResult = then(new ObjectValidator(this._model));
            this.addErrors(errorResult.Errors);
        }
        return this;
    };
    ObjectValidator.prototype.ForEach = function (predicate, action) {
        var _this = this;
        var array = predicate(this._model);
        if (array != null && array.length > 0) {
            array.forEach(function (item) { return _this.addErrors(action(new ObjectValidator(item)).Errors); });
        }
        return this;
    };
    ObjectValidator.prototype.Required = function (predicate, must, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val == null || !must(this._model, val)) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    ObjectValidator.prototype.getPropertyName = function (expression) {
        try {
            return expression(this._clonedModel)();
        }
        catch (ex) {
            return "";
        }
    };
    ObjectValidator.prototype.addErrors = function (errors) {
        var _this = this;
        if (errors != null && errors.length > 0) {
            errors.forEach(function (e) { return _this._validationErrors.push(e); });
        }
    };
    ObjectValidator.prototype.processErrors = function (predicate, val, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (errorIdentifier == null) {
            this._validationErrors.push(new validation_result_1.ValidationError(this.getPropertyName(predicate), val, message));
        }
        else {
            this._validationErrors.push(new validation_result_1.ValidationError(errorIdentifier, val, message));
        }
    };
    ObjectValidator.prototype.ToResult = function () {
        return new validation_result_1.ValidationResult(this._validationErrors);
    };
    return ObjectValidator;
}());
exports.ObjectValidator = ObjectValidator;
var RuleSetValidator = /** @class */ (function () {
    function RuleSetValidator(property, model, predicate) {
        this._model = model;
        this._predicate = predicate;
        this._property = property;
        this._validationErrors = new Array();
        this._clonedModel = type_factory_1.TypeFactory.getTypeClone(this._model);
    }
    RuleSetValidator.prototype.NotNull = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.IsNull = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property != null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.NotEmpty = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) != null) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.IsEmpty = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.Length = function (lowerBound, upperBound, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (!(this._property.toString().length >= lowerBound && this._property.toString().length <= upperBound)) {
            this.processErrors(this._property.toString(), message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.Matches = function (regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(regex) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.NotMatches = function (regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(regex) != null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.CreditCard = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.Email = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.Required = function (must, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property == null || !must(this._model, this._property)) {
            this.processErrors(this._property, message, errorIdentifier);
        }
        return this;
    };
    RuleSetValidator.prototype.ToResult = function () {
        return new validation_result_1.ValidationResult(this._validationErrors);
    };
    RuleSetValidator.prototype.processErrors = function (val, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (errorIdentifier == null) {
            this._validationErrors.push(new validation_result_1.ValidationError(this.getPropertyName(this._predicate), val, message));
        }
        else {
            this._validationErrors.push(new validation_result_1.ValidationError(errorIdentifier, val, message));
        }
    };
    RuleSetValidator.prototype.getPropertyName = function (expression) {
        try {
            return expression(this._clonedModel)();
        }
        catch (ex) {
            return "";
        }
    };
    return RuleSetValidator;
}());
