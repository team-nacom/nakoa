// copied from https://github.com/kisonecat/tikzjax/blob/master/src/index.js

import { dvi2html } from 'dvi2html';
import { Writable } from 'stream';
import { Inflate } from 'pako';
import * as library from './library';

//local compiled wasm
const texURI = '/tex.wasm';
const coreDumpURI = '/core.dump.gz'

let pages = 1000;

const prefix = `
\\documentclass[margin=0pt]{standalone}
\\def\\pgfsysdriver{pgfsys-ximera.def}
\\usepackage{tikz}`

export async function compileTex(input: string){
    // load core dump.
    let response = await fetch(coreDumpURI);
    const reader = response.body?.getReader();
    const inflator = new Inflate();

    if(!reader){
        throw new Error(coreDumpURI + ' not found');
    }

    try {
        while(true){
            const {value, done} = await reader.read();

            inflator.push(value || new Uint8Array(), done);
            if(done) break;
        }
    }
    finally {
        reader.releaseLock();
    }

    // compile tex.
    if (input.match('\\\\begin *{document}') === null) {
        input = '\\begin{document}\n' + input + '\n\\end{document}\n';
    }

    // input = prefix + input;

    library.deleteEverything();
    library.writeFileSync('sample.tex', Buffer.from(input));
    // library.writeFileSync('sample.tex', Buffer.from(input) as any);

    let memory = new WebAssembly.Memory({initial: pages, maximum: pages});
    let buffer = new Uint8Array( memory.buffer, 0, pages*65536 );
    buffer.set( new Uint8Array(inflator.result as Uint8Array, 0, pages*65536) );

    library.setMemory(memory.buffer);
    library.setInput(' sample.tex \n\\end\n');

    await WebAssembly.instantiateStreaming(fetch(texURI), {
        library: library,
        env: {memory: memory}
    });

    let dvi = library.readFileSync('sample.dvi');

    // generate inner html and style.
    let html = '';
    const page = new Writable({
        write: (chunk, encoding, callback) => {
            html = html + chunk.toString();
            callback();
        }
    }); //on dvi2html v1.5.0, the outmost tag should be <div>.

    let machine = dvi2html( Buffer.from(dvi), page);

    let style = {
        display: 'flex',
        width: machine.paperwidth + 'pt',
        height: machine.paperheight + 'pt',
        alignItems: 'center',
        justifyContent: 'center'
    };

    let svgAttributes = {
        width: style.width,
        height: style.height,
        viewBox: `-72 -72 ${machine.paperwidth} ${machine.paperheight}`
    }

    return { html, style, svgAttributes };
}