// 2021/09/12
// Slight modification of https://github.com/syntax-tree/mdast-util-directive/blob/main/index.js

import {
    Handle as FromMarkdownHandle,
    Extension as FromMarkdownExtension,
    CompileContext, Token
} from 'mdast-util-from-markdown';
import { Node, Data, Parent } from 'unist'
import { PhrasingContent } from 'mdast'
// import {
    // Node, Parent,
//     Element, Root
// } from 'hast';

import {
    Handle as ToMarkdownHandle,
    Options as ToMarkdownExtension,
    Context
} from 'mdast-util-to-markdown';

import { stringPriority } from './priority';

// interface NaHeading extends Parent{
//     type: 'heading';
//     priority?: number;
//     depth: number;
//     _numbering?: number[];
//     children: [PhrasingContent];
// }


const enterNaHeading : FromMarkdownHandle = function(token){
    this.enter({
        type: 'heading',
        priority: stringPriority['A'], //default : same as Essential. meaningless here.
        children: [],
        // data: { foo: 'foo' }
    } as any, token);
}

const exitNaHeadingSequence : FromMarkdownHandle = function (token){
    const node = this.stack[this.stack.length - 1] as any;
    node.depth = this.sliceSerialize(token).length;
}

const exitNaHeadingPriority : FromMarkdownHandle = function(token){
    const node = this.stack[this.stack.length - 1] as any;

    if(token.start.offset === token.end.offset){ //no priority marker. default : same as Essential.
        node.priority = stringPriority['A'];
    }
    else{
        node.priority = stringPriority[ this.sliceSerialize(token) ];
    }

    if(node.priority === -1) return;

    // autonumbering.
    // must be executed AFTER exitNaHeadingSequence.
    // TODO : unify this with section wrapping.
    let sectionNum = this.getData('sectionNum') as number; 
    let subsectionNum = this.getData('subsectionNum') as number;
    let subsubsectionNum = this.getData('subsubsectionNum') as number;

    if(typeof sectionNum !== 'number'){
        sectionNum = 0;
        this.setData('sectionNum',0);
    }
    if(typeof subsectionNum !== 'number'){
        subsectionNum = 0;
        this.setData('subsectionNum',0);
    }
    if(typeof subsubsectionNum !== 'number'){
        subsubsectionNum = 0;
        this.setData('subsubsectionNum',0);
    }

    if(node.depth === 1){ //section
        sectionNum++;
        node._numbering = [sectionNum];

        this.setData('sectionNum',sectionNum);
        this.setData('subsectionNum',0);
        this.setData('subsubsectionNum',0);
    }
    else if(node.depth === 2){ //subsection
        subsectionNum++;
        node._numbering = [sectionNum,subsectionNum];

        this.setData('subsectionNum',subsectionNum);
        this.setData('subsubsectionNum',0);
    }
    else if(node.depth === 3){ //subsubsection
        subsubsectionNum++;
        node._numbering = [sectionNum,subsectionNum,subsubsectionNum];

        this.setData('subsubsectionNum',subsubsectionNum);
    }
}

const exitNaHeading : FromMarkdownHandle = function(token){
    const node = this.stack[this.stack.length - 1] as any;
    if(node.children.length === 0){
        node.children.push({ type: 'text', value: '　' }); //whitespace with height, to ensure display height.
    }
    this.exit(token);
}


export const naHeadingFromMarkdown : FromMarkdownExtension = {
    canContainEols: [],
    enter: {
        naHeading: enterNaHeading,
    },
    exit: {
        naHeading: exitNaHeading,
        naHeadingSequence: exitNaHeadingSequence,
        naHeadingPriority: exitNaHeadingPriority
    }
}

// export const naHeadingToMarkdown : ToMarkdownExtension = {
//     unsafe: [],
//     handlers: {
//         textbox: handleNaHeading
//     }
// }
//
// TODO(?) : implement this!