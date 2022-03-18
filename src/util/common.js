
export function normalizeStringInObject(obj) {
    if(! obj) return;
    for(let key in obj) {
        if(obj[key] && (typeof obj[key] === 'string' || obj[key] instanceof String)) {
            obj[key] = obj[key].trim();
            if(obj[key] === "") {
                obj[key] = undefined;
            }
        }
    }
}