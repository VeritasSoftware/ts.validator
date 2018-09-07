"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as cloneDeep from 'lodash/cloneDeep';
var _ = __importStar(require("lodash"));
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
