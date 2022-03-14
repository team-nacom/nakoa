// 2021/09/12
// Slight modification of https://github.com/syntax-tree/mdast-util-directive/blob/main/index.js

import {
    Handle as FromMarkdownHandle,
    Extension as FromMarkdownExtension,
    CompileContext, Token
} from 'mdast-util-from-markdown';
import { Node, Data, Parent } from 'unist'
// import {
    // Node, Parent,
//     Element, Root
// } from 'hast';

import {
    Handle as ToMarkdownHandle,
    Options as ToMarkdownExtension,
    Context
} from 'mdast-util-to-markdown';

import { visitParents, Visitor } from 'unist-util-visit-parents';
import { containerFlow } from 'mdast-util-to-markdown/lib/util/container-flow.js';
import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js';
import { track } from 'mdast-util-to-markdown/lib/util/track.js';

interface Textbox extends Parent{
    type: 'textbox';
    // children: PhrasingContent[];
}

export const namedTextboxes = [
    'exercise',
    'expand'
] as const;
export type NamedTextboxes = typeof namedTextboxes[number];

const fenceChar = '@';

const enterTextbox : FromMarkdownHandle = function(token){
    this.enter({
        type: 'textbox',
        data: {
            name: ''
        },
        children: []
    } as any, token);
}

const enterTextboxLabel : FromMarkdownHandle = function(token){
    this.enter({
        type: 'paragraph',
        data: {
            textboxLabel: true
        },
        children: []
    },token);
}

const exitName : FromMarkdownHandle = function (token){
    const node = this.stack[this.stack.length - 1] as any;

    const name = this.sliceSerialize(token);
    if(namedTextboxes.includes(name as any)){
        node.type = name;
    }
    else{
        node.data = {
            name: name
        };
    }
}

const exitTextboxLabel : FromMarkdownHandle = function(token){
    this.exit(token);
}

const exitTextbox : FromMarkdownHandle = function(token){
    this.exit(token);
}

const handleTextbox : ToMarkdownHandle = function(node, _, context, safeOptions){
    const tracker = track(safeOptions);
    const prefix = fence(node);
    const exit = context.enter('textbox');
    // let value =
    //     prefix +
    //     (node.data.name || '') +
    //     label(node, context);

    let value = tracker.move(prefix + (node.data.name || ''));
    
    let shallow = node;
    let head : Node | undefined = (node.children || [])[0];
    head = inlineTextboxLabel(head) ? head : undefined;
    if (head && Array.isArray(head.children) && head.children.length > 0){
        const exit1 = context.enter('label');
        const exit2 = context.enter(node.type + 'Label');

        value += tracker.move('[');
        value += tracker.move(
            containerPhrasing(head as any, context, {
                ...tracker.current(),
                before: value, after: ']'
            })
        );
        value += tracker.move(']');
        exit2();
        exit1();

        shallow = Object.assign({}, node, {children: node.children.slice(1)});
    }

    if(shallow && Array.isArray(shallow.children) && shallow.children.length > 0){
        value += tracker.move('\n');
        value += tracker.move(containerFlow(shallow, context, tracker.current()));
    }

    value += tracker.move('\n' + prefix);

    exit();
    return value;
}

function inlineTextboxLabel(node? : Node) : boolean{
    return Boolean(
        node && node.type === 'paragraph' && node.data && node.data.textboxLabel
    );
}

function fence(node : Textbox) : string{
    let size = 0;

    const onvisit : Visitor = function(_, parents){
        let nesting = 0;
        for(var parent of parents){
            if(parent.type === 'textbox') nesting++;
        }

        size = nesting;
    }

    visitParents(node, 'textbox', onvisit);
    size += 3;

    return fenceChar.repeat(size);
}



export const textboxFromMarkdown : FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        textbox: enterTextbox,
        textboxLabel: enterTextboxLabel
    },
    exit: {
        textbox: exitTextbox,
        textboxLabel: exitTextboxLabel,
        textboxName: exitName
    }
}

export const textboxToMarkdown : ToMarkdownExtension = {
    unsafe: [
        {
            character: '\r',
            inConstruct: ['textboxLabel']
        },
        {
            character: '\n',
            inConstruct: ['textboxLabel']
        },
        {
            before: '[^' + fenceChar + ']',
            character: fenceChar,
            after: '[A-Za-z]',
            inConstruct: ['phrasing']
          },
          {atBreak: true, character: fenceChar, after: fenceChar}
    ],
    handlers: {
        textbox: handleTextbox
    }
}