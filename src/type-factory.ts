import * as cloneDeep from 'lodash/cloneDeep';

export class TypeFactory {
    static dictionary: Array<[string, any]> = new Array<[string, any]>();

    static getTypeClone<T>(model: T): any {
        var typeOf = model.constructor.name;
        var clonedModel = this.dictionary.filter(function(obj) { return obj[0] ==  typeOf});
        if (clonedModel != null && clonedModel.length > 0) {
            return clonedModel[0][1];
        }
        var clone = cloneDeep(model);                        
        this.dictionary.push([typeOf.toString(), clone]);
        findPropertyPath(clone);
        return clone;
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