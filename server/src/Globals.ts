export function IsDevMode(){
    return process.env.NODE_ENV == "development";
}

export function clone<T>(obj:T):T{
    return JSON.parse(JSON.stringify(obj));
}