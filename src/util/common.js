import defined from '../core/defined'



export const isString = (value) => {
    if(defined(value) && (typeof value === 'string' || value instanceof String))
        return true;
    else
        return false;
};

export const isObject = (value) => {
    return defined(value) && value.constructor === ({}).constructor;
};

export const normalizeStringInObject = (obj) => {
    if(!defined(obj)) return;
    for(let key in obj) {
        if(isString(obj[key])) {
            obj[key] = obj[key].trim();
            if(obj[key] === "") {
                obj[key] = undefined;
            }
        }
    }
};


export const resetObject = (obj) => {
    if(!defined(obj)) return obj;
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            //remove key for null/undefined value
            // if(!defined(obj[key])) {
            //     delete obj[key];
            // }
            //trim string and remove key for empty string
            //else 
            if(isString(obj[key])) {
                obj[key] = obj[key].trim();
                if(obj[key] === "") {
                    obj[key] = undefined;
                }
            }
            else if(isObject(obj[key])) {
                resetObject(obj[key]);
                // if(Object.keys(obj[key]).length === 0) {
                //     delete obj[key];
                // }
            }
        }
    }

    //return (defined(obj) && Object.keys(obj).length === 0 ? null : obj)
    return obj;
};