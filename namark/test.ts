import { promises as fs } from 'fs';
import {micromark} from 'micromark';
import {math,mathHtml} from 'micromark-extension-math';


main()

async function main() {
    const buf = await fs.readFile('example.md','utf8');
    const out = micromark(buf, {
        extensions: [math()],
        htmlExtensions: [mathHtml()]
    });
    console.log(out);
}