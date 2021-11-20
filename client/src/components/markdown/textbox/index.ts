// import { Node } from 'unist';
import { Plugin } from 'unified';
import { Root } from 'mdast';

import { textbox } from './micromark-textbox';
import { textboxFromMarkdown, textboxToMarkdown, NamedTextboxes } from './mdast-textbox'

const naMark : Plugin = function(){
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

export type { NamedTextboxes };
export default naMark;