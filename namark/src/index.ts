// import { Node } from 'unist';
import { Plugin } from 'unified';
import { Root } from 'mdast';

import { textbox } from './micromark-namark';
import { textboxFromMarkdown, textboxToMarkdown } from './mdast-namark'

const naMark : Plugin<void[], Root, Root> = function(){
    var self = this;
    var data = self.data();

    add('micromarkExtensions', textbox());
    add('fromMarkdownExtensions', textboxFromMarkdown);
    add('toMarkdownExtensions', textboxToMarkdown);

    function add(field: string, value: unknown) {
        const list = data[field];
        if ( Array.isArray(list) ) list.push(value);
        else data[field] = [value];
    }
}

export default naMark;