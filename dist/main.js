"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./validator"));
__export(require("./validation-result"));

"use strict";
exports.__esModule = true;

var TypescriptValidator;
(function (TypescriptValidator) {
    var HelloWorld = /** @class */ (function () {
        function HelloWorld() {
            alert('Hello World');
        }
        return HelloWorld;
    }());
    TypescriptValidator.HelloWorld = HelloWorld;
})(TypescriptValidator || (TypescriptValidator = {}));

"use strict";
exports.__esModule = true;
var cloneDeep = require("lodash/cloneDeep");
var TypeFactory = /** @class */ (function () {
    function TypeFactory() {
    }
    TypeFactory.getTypeClone = function (model) {
        var typeOf = model.constructor.name;
        var clonedModel = this.dictionary.filter(function (obj) { return obj[0] == typeOf; });
        if (clonedModel != null && clonedModel.length > 0) {
            return clonedModel[0][1];
        }
        var clone = cloneDeep(model);
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
exports.__esModule = true;
var type_factory_1 = require("./type-factory");
var validation_result_1 = require("./validation-result");
var Validator = /** @class */ (function () {
    function Validator(model) {
        this._model = model;
        this._validationErrors = new Array();
        this._clonedModel = type_factory_1.TypeFactory.getTypeClone(model);
    }
    Validator.prototype.NotNull = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.IsNull = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val != null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.NotEmpty = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) != null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.IsEmpty = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.Matches = function (predicate, regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) != null) {
            if (val.match(regex) == null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    Validator.prototype.NotMatches = function (predicate, regex, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.match(/^\s*$/) != null) {
            if (val.match(regex) != null) {
                this.processErrors(predicate, val, message, errorIdentifier);
            }
        }
        return this;
    };
    Validator.prototype.CreditCard = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.toString().match(/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.Email = function (predicate, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val.toString().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) == null) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.If = function (predicate, then) {
        if (predicate(this._model)) {
            var errorResult = then(new Validator(this._model));
            this.addErrors(errorResult.Errors);
        }
        return this;
    };
    Validator.prototype.ForEach = function (predicate, action) {
        var _this = this;
        var array = predicate(this._model);
        if (array != null && array.length > 0) {
            array.forEach(function (item) { return _this.addErrors(action(new Validator(item)).Errors); });
        }
        return this;
    };
    Validator.prototype.Required = function (predicate, must, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        var val = predicate(this._model);
        if (val == null || !must(this._model, val)) {
            this.processErrors(predicate, val, message, errorIdentifier);
        }
        return this;
    };
    Validator.prototype.getPropertyName = function (expression) {
        try {
            return expression(this._clonedModel)();
        }
        catch (ex) {
            return "";
        }
    };
    Validator.prototype.addErrors = function (errors) {
        var _this = this;
        if (errors != null && errors.length > 0) {
            errors.forEach(function (e) { return _this._validationErrors.push(e); });
        }
    };
    Validator.prototype.processErrors = function (predicate, val, message, errorIdentifier) {
        if (errorIdentifier === void 0) { errorIdentifier = null; }
        if (errorIdentifier == null) {
            this._validationErrors.push(new validation_result_1.ValidationError(this.getPropertyName(predicate), val, message));
        }
        else {
            this._validationErrors.push(new validation_result_1.ValidationError(errorIdentifier, val, message));
        }
    };
    Validator.prototype.Exec = function () {
        return new validation_result_1.ValidationResult(this._validationErrors);
    };
    return Validator;
}());
exports.Validator = Validator;
