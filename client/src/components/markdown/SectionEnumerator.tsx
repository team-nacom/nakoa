import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import ReactMarkdown from 'react-markdown';
import Math from 'remark-math';
import TeX from '@matejmazur/react-katex';

function nodeDeepCopy(node: Node, depth?: number) {
    let {type, position, children, ...others} = node as Parent;

    let copiedChildren : Node[] = [];
    if(!depth) depth = 0;
    if(depth <= 1 && children !== undefined){
        for(var child of children){
            copiedChildren.push( nodeDeepCopy(child,depth+1) );
        }
    }

    return {
        type : type,
        children : copiedChildren,
        ...others
        //ignore position
    } as Node;
}

function sectionPreHandler(node: Node) : boolean { //returns 'isUnnumbered'
    if('children' in node && Array.isArray(node.children)){
        if(node.children.length === 0){
            node.children.push({
                type: 'text',
                value: '　' //full-width whitespace;
            })
            return false;
        }
        else if(node.children[0].type === 'text' && ( node.children[0].value as string ).startsWith('+++')){ // e.g. `# +++References`
            node.children[0].value = ( node.children[0].value as string ).slice(3);
            return true;
        }
    }
    return false;
}

const SectionEnumerator : Plugin = () => {
    const sectionEnumerator : Transformer = (tree, file) => {
        let sectionNum = 0, subsectionNum = 0, subsubsectionNum = 0;
        
        const root = tree as Parent;
        const tocList : Node[] = [];

        for(const child of root.children){
            switch(child.type){
            case 'heading':
                child.type = 'section';

                // pre handling: ensure height, skip unnumbered
                if( sectionPreHandler(child) ){
                    break;
                }

                if (child.depth === 1){ //section
                    sectionNum += 1;
                    subsectionNum = 0;
                    subsubsectionNum = 0;

                    child.label = `${sectionNum}.`;

                    tocList.push( nodeDeepCopy(child) );
                } else if (child.depth === 2){ //subsection
                    subsectionNum += 1;
                    subsubsectionNum = 0;

                    child.label = `${sectionNum}.${subsectionNum}.`;

                    tocList.push( nodeDeepCopy(child) );
                } else if (child.depth === 3){ //subsubsection
                    subsubsectionNum += 1;

                    child.label = `${sectionNum}.${subsectionNum}.${subsubsectionNum}.`;

                    tocList.push( nodeDeepCopy(child) );
                }
                break;
            }
        }

        root.children.unshift({ type: 'toc', children: tocList });

        // console.log(root);
    }

    return sectionEnumerator;
}

const SectionRenderer = (p : any) => {
    const hnames = [ 'NA', 'section', 'subsection', 'subsubsection', 'h4', 'h5', 'h6' ];

    const htags = [ 'div', 'h2', 'h3', 'h4', 'h5', 'h6', 'h6' ]; // can be 'h1', 'h2', ...

    // console.log(p);

    var n = p;
    // var n = p.node;

    return (        
        <div className={ hnames[n.depth] }>
            <div className={ hnames[n.depth] + 'Text' }> { n.label } </div>
            {/* <h2>{ n.children }</h2> */}
            { [ React.createElement( htags[n.depth], {children: n.children}) ] }
        </div>
    )
}

export { SectionRenderer };
export default SectionEnumerator;
