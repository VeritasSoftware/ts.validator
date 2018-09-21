"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./validator"));
__export(require("./object-validator"));
__export(require("./validation-result"));

"use strict";
exports.__esModule = true;

"use strict";
exports.__esModule = true;
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
    ObjectValidator.prototype.IsLowercase = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^[a-z]+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsUppercase = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^[A-Z]+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsMixedcase = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.Contains = function (predicate, subString, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.indexOf(subString) < 0) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsNumeric = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^\d+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsAlpha = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^[a-zA-Z]+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsAlphaNumeric = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^[a-zA-Z0-9]+$/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsGuid = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsBase64 = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    ObjectValidator.prototype.IsUrl = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            if (val.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
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
    RuleSetValidator.prototype.IsLowercase = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[a-z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsUppercase = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[A-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsMixedcase = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(?=.*?[a-z])(?=.*?[A-Z])[a-zA-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsNumeric = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^\d+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsAlpha = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[a-zA-Z]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsAlphaNumeric = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[a-zA-Z0-9]+$/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsGuid = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsBase64 = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.IsUrl = function (message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/) == null) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
        }
        return this;
    };
    RuleSetValidator.prototype.Contains = function (subString, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (this._property.toString().match(/^\s*$/) == null) {
            if (this._property.toString().indexOf(subString) < 0) {
                this.processErrors(this._property.toString(), message, errorIdentifier);
            }
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

"use strict";
exports.__esModule = true;
//import * as cloneDeep from 'lodash/cloneDeep';
var _ = require("lodash");
var TypeFactory = /** @class */ (function () {
    function TypeFactory() {
    }
    TypeFactory.getTypeClone = function (model) {
        var typeOf = model.constructor.name;
        var clonedModel = this.dictionary.filter(function (obj) { return obj[0] == typeOf; });
        if (clonedModel != null && clonedModel.length > 0) {
            return clonedModel[0][1];
        }
        var clone = _.cloneDeep(model);
        this.dictionary.push([typeOf.toString(), clone]);
        findPropertyPath(clone);
        return clone;
    };
    TypeFactory.dictionary = new Array();
    return TypeFactory;
}());
exports.TypeFactory = TypeFactory;
function findPropertyPath(obj, path) {
    if (path === void 0) { path = null; }
    Object.keys(obj).map(function (k) {
        var o = obj[k];
        if (o && typeof o === "object" && !Array.isArray(o)) { // check for null then type object
            findPropertyPath(o, k);
        }
        else {
            var old = k;
            if (path != null)
                k = path + "." + k;
            return obj[old] = function () { return k; };
        }
        //return obj[k] = () => k;                
    });
}

"use strict";
exports.__esModule = true;
var ValidationResult = /** @class */ (function () {
    function ValidationResult(errors) {
        if (errors == null) {
            this.Errors = new Array();
        }
        else {
            this.Errors = errors;
        }
        this.IsValid = this.Errors.length <= 0;
    }
    ValidationResult.prototype.Identifier = function (identifier) {
        var results = this.Errors.filter(function (obj) { return obj.Identifier == identifier; });
        if (results != null) {
            return results[0];
        }
        return null;
    };
    ValidationResult.prototype.IdentifierStartsWith = function (identifier) {
        var results = this.Errors.filter(function (obj) { return obj.Identifier.startsWith(identifier); });
        if (results != null) {
            return results;
        }
        return null;
    };
    return ValidationResult;
}());
exports.ValidationResult = ValidationResult;
var ValidationError = /** @class */ (function () {
    function ValidationError(identifier, value, message) {
        this.Message = message;
        this.Value = value;
        this.Identifier = identifier;
    }
    return ValidationError;
}());
exports.ValidationError = ValidationError;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var object_validator_1 = require("./object-validator");
var validation_result_1 = require("./validation-result");
var Validator = /** @class */ (function () {
    function Validator(model) {
        this._model = model;
        this._validationErrors = new Array();
        this._basesAsync = new Array();
    }
    Validator.prototype.ValidateBase = function (rules) {
        var _this = this;
        var base = this._model;
        if (base != null) {
            var validationResult = new Validator(base).Validate(rules);
            if (validationResult.Errors.length > 0) {
                validationResult.Errors.forEach(function (error) { return _this._validationErrors.push(error); });
            }
        }
        return this;
    };
    Validator.prototype.ValidateBaseAsync = function (rules) {
        var base = this._model;
        this._basesAsync.push(new BaseRules(base, rules));
        return this;
    };
    Validator.prototype.Validate = function (rules) {
        return rules(new object_validator_1.ObjectValidator(this._model));
    };
    Validator.prototype.ValidateAsync = function (rules) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve, reject) {
                    if (_this._basesAsync.length > 0) {
                        _this._basesAsync.forEach(function (base) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var validationResult;
                            return __generator(this, function (_a) {
                                validationResult = base._rules(new object_validator_1.ObjectValidator(base._model));
                                if (validationResult.Errors.length > 0) {
                                    validationResult.Errors.forEach(function (error) { return _this._validationErrors.push(error); });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    }
                    var validationResult = rules(new object_validator_1.ObjectValidator(_this._model));
                    if (validationResult.Errors.length > 0) {
                        validationResult.Errors.forEach(function (error) { return _this._validationErrors.push(error); });
                    }
                    resolve(new validation_result_1.ValidationResult(_this._validationErrors));
                });
                return [2 /*return*/, promise];
            });
        });
    };
    return Validator;
}());
exports.Validator = Validator;
var BaseRules = /** @class */ (function () {
    function BaseRules(model, rules) {
        this._model = model;
        this._rules = rules;
    }
    return BaseRules;
}());
exports.BaseRules = BaseRules;
