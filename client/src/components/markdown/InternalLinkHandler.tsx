import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

const InternalLinkHandler : Plugin = () => {
    const internalLinkHandler : Transformer = (tree, file) => {
        const root = tree as Parent;

        visit(root, 'link', (node) => {
            if(typeof node.url === 'string' && node.url.startsWith('guide:')){
                var idStr = node.url.slice('guide:'.length)

                // console.log(idStr);

                var id = Number(idStr)

                if(!isNaN(id)){
                    node.type = 'intLink';
                    node.for = 'guide';
                    node.target = id;
                }
            }
        })
    }

    return internalLinkHandler;
}

export default InternalLinkHandler;