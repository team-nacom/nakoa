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

import { visitParents, Visitor } from 'unist-util-visit-parents'
import {containerFlow} from 'mdast-util-to-markdown/lib/util/container-flow.js'
import {containerPhrasing} from 'mdast-util-to-markdown/lib/util/container-phrasing.js'

interface Textbox extends Parent{
    type: 'textbox';
    // children: PhrasingContent[];
}

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
    const node = this.stack[this.stack.length - 1];
    node.data = {
        name: this.sliceSerialize(token)
    };
}

const exitTextboxLabel : FromMarkdownHandle = function(token){
    this.exit(token);
}

const exitTextbox : FromMarkdownHandle = function(token){
    this.exit(token);
}

const handleTextbox : ToMarkdownHandle = function(node, _, context){
    const prefix = fence(node);
    const exit = context.enter('textbox');
    let value =
        prefix +
        (node.data.name || '') +
        label(node, context);

    const subvalue = content(node, context);
    if (subvalue) value += '\n' + subvalue;
    value += '\n' + prefix;

    exit();
    return value;
}

const label = function(node : Textbox, context : Context){
    const head = (node.children || [])[0];
    if(!inlineTextboxLabel(head as Node)) return '';

    const exit = context.enter('label');
    const subexit = context.enter(node.type + 'Label');
    const value = containerPhrasing(head as any, context, {before: '[', after: ']'});
    subexit();
    exit();
    return value ? '[' + value + ']' : '';
}

function content(node : Textbox, context : Context) : string{
    const head = (node.children || [])[0];

    if (inlineTextboxLabel(head as Node)){
        node = Object.assign({}, node, {children: node.children.slice(1)});
    }

    return containerFlow(node as any, context);
}

function inlineTextboxLabel(node? : Node) : boolean{
    return Boolean(
        node && node.type === 'paragraph' && node.data && node.data.textboxLabel
    );
}

function fence(node : Textbox) : string{
    let size = 0;

    const onvisit : Visitor<Textbox> = function(_, parents){
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