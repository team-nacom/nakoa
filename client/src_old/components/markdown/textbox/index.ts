// import { Node } from 'unist';
import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

import { Root as MdastRoot, Parent as MdastParent } from 'mdast';
import { ElementContent } from 'hast';
import { H, Handler, one, all } from 'mdast-util-to-hast';
import { u } from 'unist-builder';

import { textbox } from './micromark-textbox';
import { textboxFromMarkdown, textboxToMarkdown, namedTextboxes, NamedTextboxes } from './mdast-textbox'

type MdastNode = MdastRoot | MdastParent['children'][number];

const NamarkTextbox : Plugin = function(){
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

    //traverse tree and attach label
    //This plugin is called BEFORE remark-rehype.
    const namarkTextbox : Transformer = (tree, file) => {
        visit(tree, ['textbox', ...namedTextboxes], (node)=>{
            if(node.children && Array.isArray(node.children) && node.children.length > 0){
                let cNode = (node as Parent).children[0];
                if(cNode.type === 'paragraph' && cNode.data?.textboxLabel){
                    node.label = cNode; //label is wrapped with 'paragraph'.
                    node.children = (node as Parent).children.slice(1);
                }
            }
        })
    }
    return namarkTextbox;
}

type INamedTextbox = {
    [name in NamedTextboxes]: Handler;
}

const NamarkTextboxToHast : Record<string,Handler> & INamedTextbox = {
    textbox: (h, node) => {
        let labelHNode = all(h, node.label || []);
        return h(node, 'div', { className: 'textframe' },
            [...labelHNode, ...all(h,node)]
        );
    },
    exercise: (h, node) => {
        let labelHNode = all(h, node.label || []);
        return h(node, 'div', { className: 'exercise' },
            [
                h(node.label, 'div', { className: 'label' }, [
                    u('text','연습문제 '),
                    ...labelHNode
                ]),
                h(null, 'div', all(h,node))
            ]
        );
    },
    expand: (h, node) => {
        let labelHNode = all(h, node.label || []);
        return h(node, 'details', { className: 'expand' },
            [
                h(node.label, 'summary', labelHNode),
                h(null, 'div', all(h,node))
            ]
        );
    }
}

export { NamarkTextbox, NamarkTextboxToHast };