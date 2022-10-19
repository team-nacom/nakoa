import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

interface PerrefHandlerOption{
    map?: Record<string, string | number[]>;
}

const PerrefHandler : Plugin = (option?: PerrefHandlerOption) => {
    const map = option?.map || {};

    const perrefHandler : Transformer = (tree, file) => {
        const root = tree as Parent;

        // might need more than this:
        // instead of string replacement, make a separate node and only the %% node would subscribe the map.
        // possible difficulties: what to do in math mode?
        visit(root, ['text', 'math', 'inlineMath'], (node: any) => {
            let val = node.value as string || '';
            node.value = val.replace(/%[\w-]+%/g,(match)=>{
                let word = match.slice(1,-1);

                let result = map[word];
                if(Array.isArray(result)){
                    result = result.join('.');
                }

                return result || match;
            })
        })
    }

    return perrefHandler;
}

export default PerrefHandler;