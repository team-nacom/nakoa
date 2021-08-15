import React from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

type Visitor = visit.Visitor<Node>;

const textDirectives = [
    'guide',
] as const;
type TextDirectives = typeof textDirectives[number];

const leafDirectives = [
    // 'exercise'
] as const;
type LeafDirectives = typeof leafDirectives[number];

const containerDirectives = [
    'exercise',
    'expand'
] as const;
type ContainerDirectives = typeof containerDirectives[number];

const DirectiveHandler : Plugin = () => {
    function onTextDirective(node : Node) {
        if(typeof node.name !== 'string' || !textDirectives.includes(node.name as TextDirectives)) return;
        // as statement itself fails when node.name is not in textDirectives.
        // so we guard it by node.name.
        // actually, we don't have to guard this except that textDirectives can be empty.

        switch(node.name as TextDirectives){
        default:
            node.type = node.name;
            node.directive = 'text';
            delete node.name;
        }
    }
    function onLeafDirective(node : Node) {
        if(typeof node.name !== 'string' || !leafDirectives.includes(node.name as LeafDirectives)) return;

        switch(node.name as LeafDirectives){
        default:
            node.type = node.name;
            node.directive = 'leaf';
            delete node.name;
        }
    }
    function onContainerDirective(node : Node) {
        if(typeof node.name !== 'string' || !containerDirectives.includes(node.name as ContainerDirectives)) return;

        switch(node.name as ContainerDirectives){
        default:
            node.type = node.name;
            node.directive = 'container';
            delete node.name;
        }
    }

    const directiveHandler : Transformer = (tree, file) => {
        visit(tree, ['textDirective'], onTextDirective);
        visit(tree, ['leafDirective'], onLeafDirective);
        visit(tree, ['containerDirective'], onContainerDirective);
    }

    return directiveHandler;
}

export type { TextDirectives, LeafDirectives, ContainerDirectives };
export default DirectiveHandler;
