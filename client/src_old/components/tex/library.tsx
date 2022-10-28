// copied from https://github.com/kisonecat/tikzjax/blob/master/src/library.js

import { tfmData } from 'dvi2html';

import filesystem from './filesystem.json';

let fs = filesystem as Record<string, string>;

/****************************************************************/
// fake files

interface FakeFile {
    filename: string;
    position: number;
    erstat: number;
    buffer: Uint8Array;
    descriptor?: number;
    eof?: boolean;
    eoln?: boolean;
}

let files : FakeFile[] = [];

function pushFile(filename: string, buffer?: Uint8Array, autoDescriptor?: boolean){
    files.push({
        filename,
        position: 0,
        erstat: 0,
        buffer: buffer || new Uint8Array(),
        descriptor: autoDescriptor ? files.length : undefined,
    });
    return files.length - 1;
}

export function deleteEverything() {
    files = [];
}

export function writeFileSync(filename: string, buffer: Uint8Array){
    fs[filename] = btoa(buffer.toString());
}

export function readFileSync(filename: string){
    for(let f of files){
        if(f.filename === filename){
            return f.buffer.slice(0, f.position);
        }
    }
    throw Error(`Could not find file ${filename}`);
}

function openSync(filename: string, mode: string){
    let buffer = new Uint8Array();

    if (fs[filename]) {
        // buffer <- filesystem[filename]
        buffer = Uint8Array.from(Buffer.from(fs[filename], 'base64'));
    }

    if (filename.match(/\.tfm$/)) {
        // buffer <- tfmData(filename)
        buffer = Uint8Array.from( tfmData( filename.replace(/\.tfm$/, '' ) ) );
    }

    return pushFile(filename, buffer, true);
}

function closeSync( fd: number ) {
    // ignore this.
}

function writeSync(file: FakeFile, buffer: Uint8Array, pointer?: number, length?: number){
    if (pointer === undefined) pointer = 0;
    if (length === undefined) length = buffer.length - pointer;

    while (length > file.buffer.length - file.position) {
        let b = new Uint8Array( 1 + file.buffer.length * 2 );
        b.set( file.buffer );
        file.buffer = b;
    }
    
    file.buffer.subarray(file.position).set( buffer.subarray(pointer, pointer+length) );
    file.position += length;
}

function readSync( file: FakeFile, buffer: Uint8Array, pointer?: number, length?: number, seek?: number ){
    if (pointer === undefined) pointer = 0;
    if (length === undefined) length = buffer.length - pointer;
    if (seek === undefined) seek = 0;

    if (length > file.buffer.length - seek) length = file.buffer.length - seek;
    
    buffer.subarray(pointer).set( file.buffer.subarray(seek, seek+length) );

    return length;
}

/****************************************************************/
// fake process.write.stdout

var consoleBuffer = '';
function writeToConsole(str: string) {
    consoleBuffer = consoleBuffer + str;
    if (consoleBuffer.indexOf('\n') >= 0) {
        let lines = consoleBuffer.split('\n');
        consoleBuffer = lines.pop() || '';
        for( let line of lines ) {
            console.log(line);
        }
    }
}
var process = {
  stdout: {
    write: writeToConsole
  }
};

/****************************************************************/
// setup

var memory : ArrayBuffer = new Uint8Array();
var inputBuffer = '';
var callback : Function = (() => {});

export function setMemory(m: ArrayBuffer) {
  memory = m;
}

export function setInput(input: string, cb?: Function) {
  inputBuffer = input;
  if (cb) callback = cb;
}

/****************************************************************/
// provide time back to tex

export function getCurrentMinutes() {
    var d = (new Date());
    return 60 * (d.getHours()) + d.getMinutes();
}

export function getCurrentDay() {
    return (new Date()).getDate();
}

export function getCurrentMonth() {
    return (new Date()).getMonth() + 1;
}

export function getCurrentYear() {
    return (new Date()).getFullYear();    
}

/****************************************************************/
// print

function printRawString(descriptor: number, str: string){
    if(descriptor < 0 || files[descriptor].filename === ':stdout'){
        process.stdout.write(str);
        return;
    }
    writeSync(files[descriptor], Buffer.from(str));
}

export function printString(descriptor: number, x: number) {
    var length = new Uint8Array( memory, x, 1 )[0];
    var buffer = new Uint8Array( memory, x+1, length );
    // var string = String.fromCharCode.apply(null, Array.from(buffer));
    var string = String.fromCharCode.apply(null, buffer as any);

    printRawString(descriptor, string);
}
export function printBoolean(descriptor: number, x: boolean){
    printRawString(descriptor, x ? 'TRUE' : 'FALSE');
}
export function printChar(descriptor: number, x: number){
    // printRawString(descriptor, String.fromCharCode(x));

    if(descriptor < 0 || files[descriptor].filename === ':stdout'){
        process.stdout.write(String.fromCharCode(x));
        return;
    }

    var b = Buffer.alloc(1);
    b[0] = x;
    writeSync(files[descriptor], b);
}
export function printInteger(descriptor: number, x: number){
    printRawString(descriptor, x.toString());
}
export function printFloat(descriptor: number, x: number){
    printRawString(descriptor, x.toString());
}
export function printNewline(descriptor: number, x: any){
    printRawString(descriptor, '\n');
}

export function reset(length: number, pointer: number){
    var buffer = new Uint8Array( memory, pointer, length );
    // var filename = String.fromCharCode.apply(null, Array.from(buffer));
    var filename = String.fromCharCode.apply(null, buffer as any);

    filename = filename.replace(/ +$/g,'')
                        .replace(/^\*/,'')
                        .replace(/^TeXfonts:/,'');
    
    if (filename === 'TeXformats:TEX.POOL') filename = 'tex.pool';
    if (filename === 'TTY:') {
        return pushFile(':stdin');
    }
    return openSync(filename, 'r');
}

export function rewrite(length: number, pointer: number){
    var buffer = new Uint8Array( memory, pointer, length );
    var filename = String.fromCharCode.apply(null, Array.from(buffer));

    filename = filename.replace(/ +$/g,''); 

    if (filename === 'TTY:') {
        return pushFile(':stdout');
    }
    return openSync(filename, 'w');
}

export function close(descriptor: number){
    var file = files[descriptor];
    if(file?.descriptor){
        closeSync( file.descriptor );
    }
}

export function eof(descriptor: number){
    return files[descriptor].eof ? 1 : 0;
}

export function eoln(descriptor: number){
    return files[descriptor].eoln ? 1 : 0;
}

export function erstat(descriptor: number){
    return files[descriptor].erstat;
}

export function get(descriptor: number, pointer: number, length: number){
    var file = files[descriptor];
    var buffer = new Uint8Array( memory );

    if(file.filename === ':stdin'){
        if(file.position >= inputBuffer.length){
            buffer[pointer] = 13;
            file.eof = true;
            file.eoln = true;
            if(callback) callback();
        } else{
            buffer[pointer] = inputBuffer[file.position].charCodeAt(0);
        }
    } else{
        if(file.descriptor){
            if(readSync(file, buffer, pointer, length, file.position) === 0){
                buffer[pointer] = 0;
                file.eof = true;
                file.eoln = true;
                return;
            }
        } else{
            file.eof = true;
            file.eoln = true;
            return;
        }
    }

    file.eoln = false;
    if(buffer[pointer] === 10 || buffer[pointer] === 13){
        file.eoln = true;
    }
    file.position = file.position + length;
}

export function put(descriptor: number, pointer: number, length: number){
    var file = files[descriptor];
    var buffer = new Uint8Array(memory);
    
    writeSync(file,buffer,pointer,length);
}