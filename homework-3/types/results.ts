export enum ResultCodeValues {
    CODE_OK = 0,
    CODE_NOT_FOUND = 100,
    CODE_VALIDATION_ERROR = 101
}

export interface ResultCode {
    code: ResultCodeValues;
    value?: any;
}

export function resultCode(code: ResultCodeValues){
    return {code};
}