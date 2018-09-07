"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
