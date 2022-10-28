import { codes } from 'micromark-util-symbol/codes'

const codePriority : Record<number, number> = {
    [codes.uppercaseD] : 1, //Optional
    [codes.uppercaseC] : 2, //Readable
    [codes.uppercaseB] : 3, //Recommendable
    [codes.uppercaseA] : 4, //Essential
    [codes.uppercaseE] : 0, //Draft
    [codes.plusSign]   : -1
};

const stringPriority : Record<string, number> = {
    'D' : 1,
    'C' : 2,
    'B' : 3,
    'A' : 4,
    'E' : 0,
    '+' : -1,
    ''  : 4    //same as essential.
};

export { codePriority, stringPriority };