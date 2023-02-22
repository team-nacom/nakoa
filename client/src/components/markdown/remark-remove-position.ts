import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

const RemovePosition : Plugin = (option?: any) => {
    const removePosition : Transformer = (tree, file) => {
        const root = tree as Parent;

        visit(root, null, (node: any) => {
            delete node.position
        })
    }

    return removePosition;
}

export default RemovePosition;