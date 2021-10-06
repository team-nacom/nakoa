import React, { useState, useRef, useEffect, Component } from 'react';
import ContentEditable from 'react-contenteditable';
import { Children } from 'react-router/node_modules/@types/react';

import TextareaAutosize from 'react-textarea-autosize';

interface IBubble {
    type: string,
    parent?: ParentBubble,

    getLabel(): string,
    serialize(depth : number): string,
    render(): React.ReactElement,
    preview(): React.ReactElement
}

class ParentBubble implements IBubble{
    type : string = 'parent';
    children : IBubble[] = [];

    constructor(children? : IBubble[]){
        this.children = children || [];
        this.children.forEach((child)=>{
            child.parent = this;
        });
    }

    getLabel(){
        return '';
    }

    serialize(depth: number){
        var fence = '@'.repeat(depth);
        var str = '';
        for(var child of this.children ){
            var childstr
                = fence + child.getLabel() + '\n'
                + child.serialize(depth+1)
                + '\n' + fence + '\n';

            str += childstr;
        }
        return str;
    }

    render(){
        // console.log( this.preview() )
        return (<div>
            { this.children.map((child)=>{
                return child.render()
            }) }
        </div>);
    }

    preview(){
        return (<>
            { this.children.map((child)=>{
                return child.preview()
            }) }
        </>);
    }
}

class TextBubble implements IBubble{
    type : string = 'text';
    contents : string = '';
    parent? : ParentBubble = undefined;
    ref : React.RefObject<HTMLTextAreaElement>;

    constructor(contents? : string){
        this.contents = contents || '';
        this.ref = React.createRef();
    }

    getLabel(){
        return 'text';
    }

    serialize(depth: number){
        return this.contents;
    }

    render(){
        // const changeHandler = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        //     e.preventDefault();
        //     e.stopPropagation();

        //     if(!this.ref.current) return;

        //     var str : string = this.ref.current.value;
        //     this.contents = str;

        //     var curStart : number = this.ref.current.selectionStart;
        //     var curEnd : number = this.ref.current.selectionEnd;

        //     var lineStart : number = this.ref.current.value.lastIndexOf('\n',curStart-1) + 1; //if '\n' not found, lineStart === 0.
        // }

        const keyupHandler = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
            // e.preventDefault();
            // e.stopPropagation();
            
            if(!this.ref.current) return;

            var str : string = this.ref.current.value;
            this.contents = str;

            if(e.key === 'Enter'){
                var curStart : number = this.ref.current.selectionStart; // str[curStart] === '\n' expected.
                var curEnd : number = this.ref.current.selectionEnd;

                if(str[curStart] !== '\n') return;

                var lineStart : number = str.lastIndexOf('\n',curStart-2) + 1; //previous line.
                //if '\n' not found, lineStart === 0.

                // console.log(str.slice(lineStart,curStart).split('') );

                var result = str.slice(lineStart,curStart-1).match(/^(@{3,})([a-zA-Z0-9]*)(?:\[(.*)\])?$/);

                if(!result) return;

                // create a new bubble based on type.
                // for now we only support on text bubbles.
                // result[2] : type
                // result[3] : label

                console.log(this.parent);

                if(!this.parent) return;

                this.contents = str.slice(0, lineStart);
                this.ref.current.value = this.contents;
                var newTextBubble = new TextBubble(str.slice(curStart + 1));

                addBubbleAfter(newTextBubble,this.parent,this);

                console.log(this.parent);
            }
        }

        return <TextareaAutosize
            style={ {display:'block', width:'100%'} }
            ref={ this.ref }
            // onChange={ changeHandler.bind(this) }
            onKeyUp={ keyupHandler.bind(this) }
        >
            { this.contents }
        </TextareaAutosize>;
    }

    preview(){
        return <div>
            { this.contents }
        </div>;
    }
}

// function createBubble(type : string, label : string): IBubble {
//     //TODO : add more types!
//     switch(type){
//         case 'parent':
//             return new ParentBubble([]);
//             break;
//         default:
//             return new TextBubble('');
//     }

//     return new TextBubble('');
// }

function addBubbleAfter(newBubble : IBubble, parent : ParentBubble, sibling? : IBubble){
    var idx : number
        = sibling? parent.children.indexOf(sibling)
        : parent.children.length - 1;
    
    newBubble.parent = parent;
    parent.children.splice(idx, 0, newBubble);
}

var namu = new ParentBubble([
    new TextBubble('AAAAAA'),
    new TextBubble('BBB'),
]);

export type { IBubble };
export { ParentBubble, TextBubble };