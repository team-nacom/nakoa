// 2021/09/12
// Slight modification of https://github.com/syntax-tree/mdast-util-directive/blob/main/index.js

import { BlockContent, Paragraph } from 'mdast';
import {
    Handle as FromMarkdownHandle,
    Extension as FromMarkdownExtension,
    CompileContext, Token
} from 'mdast-util-from-markdown';
import { Node, Parent } from 'mdast-util-from-markdown/lib'
import {
    Handle as ToMarkdownHandle,
    Options as ToMarkdownExtension,
    Context
} from 'mdast-util-to-markdown';

interface Textbox extends Parent {
    type: 'textbox';
    // children: PhrasingContent[];
}

// type Textbox = Parent; /////////////TODO: ADD TYPE DEFINITION

import {decodeEntity} from 'parse-entities/decode-entity.js'
import {stringifyEntitiesLight} from 'stringify-entities'
import { visitParents, Visitor } from 'unist-util-visit-parents'
import {containerFlow} from 'mdast-util-to-markdown/lib/util/container-flow.js'
import {containerPhrasing} from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import {checkQuote} from 'mdast-util-to-markdown/lib/util/check-quote.js'
import { isLabeledStatement } from 'typescript';

const fenceChar = '@';

const enterTextbox : FromMarkdownHandle = function(token){
    this.enter({
        type: 'textbox',
        name: '',
        attributes: {},
        children: []
    }, token);
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
    node.name = this.sliceSerialize(token);
}

const exitTextboxLabel : FromMarkdownHandle = function(token){
    this.exit(token);
}

const exit : FromMarkdownHandle = function(token){
    this.exit(token);
}

const handleTextbox : ToMarkdownHandle = function(node, _, context){
    const prefix = fence(node);
    const exit = context.enter(node.type);
    let value =
        prefix +
        (node.name || '') +
        label(node, context);
    
    if (node.type === 'textbox'){
        const subvalue = content(node, context);
        if (subvalue) value += '\n' + subvalue;
        value += '\n' + prefix;
    }

    exit();
    return value;
}

const peekTextbox : ToMarkdownHandle = function(){
    return fenceChar;
}

const label = function(node : Textbox, context : Context){
    const head = (node.children || [])[0];
    if(!inlineTextboxLabel(head)) return '';

    const exit = context.enter('label');
    const subexit = context.enter(node.type + 'Label');
    const value = containerPhrasing(head, context, {before: '[', after: ']'});
    subexit();
    exit();
    return value ? '[' + value + ']' : '';
}

function content(node : Textbox, context : Context) : string{
    const head = (node.children || [])[0];

    if (inlineTextboxLabel(head)){
        node = Object.assign({}, node, {children: node.children.slice(1)});
    }

    return containerFlow(node, context);
}

function inlineTextboxLabel(node? : Node) : boolean{
    return Boolean(
        node && node.type === 'paragraph' && node.data && node.data.textboxLabel
    );
}

function decodeLight(value : string) : string{
    return value.replace(
        /&(#(\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi,
        decodeIfPossible
    )
}

function decodeIfPossible($0 : string, $1 : string) : string{
    return decodeEntity($1) || $0;
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
        textbox: exit,
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