import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { u } from 'unist-builder';
import { visit } from 'unist-util-visit';

interface InlineRenderHandlerOption{
    prefix?: string
}

const InlineRenderHandler : Plugin = (option?: InlineRenderHandlerOption) => {
    return ((tree, file) => {
        if(option === undefined || option.prefix === undefined) return;

        let root = tree as Parent;
        if(root.children && Array.isArray(root.children) && root.children.length > 0){
            let child = root.children[0] as Parent;

            if(child.children && Array.isArray(child.children)){
                child.children.unshift(u('text', option.prefix));
            }

            root.children = [child];
        }
    })
}
export default InlineRenderHandler