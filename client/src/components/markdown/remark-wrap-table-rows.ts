import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

const WrapTableRows : Plugin = (option?: any) => {
    const wrapTableRows : Transformer = (tree, file) => {
        const root = tree as Parent;

        visit(root, 'table', (table: any) => {
            const children = table.children
            table.children = [
                {
                    type: 'tableHead',
                    align: table.align,
                    children: [children[0]],
                    position: children[0].position
                }
            ]
            if (children.length > 1) {
                table.children.push({
                    type: 'tableBody',
                    align: table.align,
                    children: children.slice(1),
                    position: {
                        start: children[1].position.start,
                        end: children[children.length - 1].position.end
                    }
                })
            }
        })
    }

    return wrapTableRows;
}

export default WrapTableRows;