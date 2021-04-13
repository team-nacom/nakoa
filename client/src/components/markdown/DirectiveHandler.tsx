import React from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

const DirectiveHandler : Plugin = () => {
    function onTextDirective(node : Node) {
        switch(node.name){
        default: break;
        }
    }
    function onLeafDirective(node : Node) {
        switch(node.name){
        case 'exercise':
            node.type = 'exercise';
            delete node.name;
            break;
        default: break;
        }
    }
    function onContainerDirective(node : Node) {
        switch(node.name){
        case 'expand':
            node.type = 'expand'
            delete node.name;
            break;
        default: break;
        }
    }

    const directiveHandler : Transformer = (tree, file) => {
        visit(tree, ['textDirective'], onTextDirective);
        visit(tree, ['leafDirective'], onLeafDirective);
        visit(tree, ['containerDirective'], onContainerDirective);
    }

    return directiveHandler;
}

export default DirectiveHandler;
