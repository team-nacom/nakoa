import React, { Children } from 'react';
import { Link } from 'react-router-dom';
// import { HashLink } from 'react-router-hash-link';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';

function nodeDeepCopy(node: Node, copyPosition?: boolean, depth?: number) {
    let {type, position, children, ...others} = node as Parent;

    let copiedChildren : Node[] = [];
    if(!depth) depth = 0;
    if(depth <= 1 && children !== undefined){
        for(var child of children){
            copiedChildren.push( nodeDeepCopy(child, copyPosition, depth+1) );
        }
    }

    return {
        type : type,
        position : (copyPosition? position : undefined),
        children : copiedChildren,
        ...others
        //ignore position
    } as Node;
}

const FootnoteEnumerator : Plugin = () => {
    const footnoteEnumerator : Transformer = (tree, file) => {
        const root = tree as Parent;
        const footnoteList = {
            type: 'footnoteList',
            children: [] as Node[]
        } as Parent;

        const identifiers = [']'] as string[];

        visit(root, (node) => {
            if(node.type === 'footnote'){
                const protectedId = `]${ node.position?.start.line }-${ node.position?.start.column }`;

                node.identifier = protectedId;
                node.label = identifiers.length;
                identifiers.push( protectedId );

                const copy = nodeDeepCopy(node);
                copy.type = 'footnoteDefinition';
                footnoteList.children.push( copy );

                node.type = 'footnoteReference';
            }
            else if(node.type === 'footnoteReference'){
                const id = node.identifier as string;
                var l = identifiers.indexOf( id );
                if(l === -1){
                    l = identifiers.length;
                    identifiers.push( id );
                }
                node.label = l;
            }
        })

        visit(root, 'footnoteDefinition', (node) => {
            const id = node.identifier as string;
            var l = identifiers.indexOf( id );
            if(l === -1){
                l = identifiers.length;
                identifiers.push( id );
            }
            node.label = l;

            footnoteList.children.push( nodeDeepCopy(node) );
        })

        remove(root, 'footnote');
        remove(root, 'footnoteDefinition');

        footnoteList.children.sort( (a:Node,b:Node) => { return (a.label as number) - (b.label as number) } )
        root.children.push(footnoteList);

        // console.log(root);
    }

    return footnoteEnumerator;
}

const FootnoteDefinitionRenderer = (p : any) => {
    var n = p;
    // var n = p.node;

    var idstr = n.identifier as string;
    var refstr : string;
    if( idstr.startsWith(']') ){
        refstr = 'inline-' + idstr.slice(1);
    }
    else{
        refstr = 'link-' + idstr;
    }

    return (
        <div className='footnoteItem' id={`fn-${ refstr }`}>
            <span className='footnoteNumber'>
                <p>
                    <a href={ `#fnref-${ refstr }` } className="footnote-backref"> { `${n.label}.` } </a>
                </p>
            </span> 
            <span className='footnoteBody'>
                { n.identifier[0] === ']' ? <p> { n.children } </p> : n.children }
            </span>
        </div>
    )
}

const FootnoteReferenceRenderer = (p : any) => {
    var n = p;
    // var n = p.node;

    var idstr = n.identifier as string;
    var refstr : string;
    if( idstr.startsWith(']') ){
        refstr = 'inline-' + idstr.slice(1);
    }
    else{
        refstr = 'link-' + idstr;
    }

    return (
        <sup id={ `fnref-${ refstr }` } >
            <a href={ `#fn-${ refstr }` } className='footnote-ref'>[{ n.label }]</a>
        </sup>
    )
}

export { FootnoteDefinitionRenderer, FootnoteReferenceRenderer };
export default FootnoteEnumerator;