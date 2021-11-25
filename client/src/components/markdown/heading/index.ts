// import { Node } from 'unist';
import { Plugin } from 'unified';
import { Root } from 'mdast';

import { naHeading } from './micromark-naheading';
import { naHeadingFromMarkdown, /* naHeadingToMarkdown */ } from './mdast-naheading'

const namarkNaHeading : Plugin = function(){
    var self = this;
    var data = self.data();

    add('micromarkExtensions', naHeading());
    add('fromMarkdownExtensions', naHeadingFromMarkdown);
    // add('toMarkdownExtensions', textboxToMarkdown);

    function add(field: string, value: unknown) {
        const list = data[field];
        if ( Array.isArray(list) ) list.push(value);
        else data[field] = [value];
    }
}

export default namarkNaHeading;