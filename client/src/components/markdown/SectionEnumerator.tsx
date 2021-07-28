import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import ReactMarkdown from 'react-markdown';
import Math from 'remark-math';
import TeX from '@matejmazur/react-katex';

import { HashLink } from 'react-router-hash-link';
import { priorityTags } from 'etc/api/guide';
import { FormattedMessage } from 'react-intl';

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
        copied : true,
        ...others
        //ignore position
    } as Node;
}

function tocHeadingCopy(node: Node){
    let copied = nodeDeepCopy(node);

    //priority should have been copied at this point
    copied.type = 'tocHeading';
    return copied;
}

const SectionEnumerator : Plugin = () => {
    const sectionEnumerator : Transformer = (tree, file) => {
        let sectionNum = 0, subsectionNum = 0, subsubsectionNum = 0;
        
        const root = tree as Parent;
        const tocList : Node[] = [];

        // wrap section block
        var stack: number[] = [];
        for(var nodeno = 0; nodeno < root.children.length; ++nodeno){
            //root.children.length may (certainly) change during iteration.
            const node = root.children[nodeno]

            node.numbering = [] as Number[];

            if(node.type === 'heading'){
                node.type = 'contentsHeading';
                if (node.depth === 1){ //section
                    if(node.data?.priority !== -1){
                        sectionNum += 1;
                        node.numbering = [sectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                    subsectionNum = 0;
                    subsubsectionNum = 0;
                } else if (node.depth === 2){ //subsection
                    if(node.data?.priority !== -1){
                        subsectionNum += 1;
                        node.numbering = [sectionNum,subsectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                    subsubsectionNum = 0;
                } else if (node.depth === 3){ //subsubsection
                    if(node.data?.priority !== -1){
                        subsubsectionNum += 1;
                        node.numbering = [sectionNum,subsectionNum,subsubsectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                }
            }
        }


        root.children.unshift({ type: 'toc', children: tocList });

        console.log(root);
    }

    return sectionEnumerator;
}


const hnames = [ 'NA', 'section', 'subsection', 'subsubsection', 'h4', 'h5', 'h6' ];

const htags = [ 'div', 'h2', 'h3', 'h4', 'h5', 'h6', 'h6' ]; // can be 'h1', 'h2', ...

const TocHeadingRendererFactory = (isManual? : boolean) =>{
    return (n : any) => (        
        <div className={ hnames[n.depth] }>
            { n.priority !== -1 &&
                <HashLink
                    to={ (isManual ? '#man-':'#') + 'heading-' + n.numbering.join('-') }
                    className={ hnames[n.depth] + 'Num' }
                >
                    { n.numbering.join('.')+'.' }
                </HashLink>
            }
            { [ React.createElement( htags[n.depth], {children: n.children}) ] }
        </div>
    )
}

const ContentsHeadingRendererFactory = (isManual? : boolean) => {
    return (n : any) => {
        // console.log(n);
        let children = n.children;
        // console.log(children);
        if (!isManual) {
            children = children.concat([(
                <span style={{ fontSize: '10px', marginLeft: '10px' }}>
                    { priorityTags[n.priority] }
                </span>
            )])
        }

        return (        
            <div className={ hnames[n.depth] }>
                { n.priority !== -1 &&
                    <HashLink
                        to={ (isManual ? '#man-':'#') + 'toc-label' }
                        id={ (isManual ? 'man-':'') + 'heading-' + n.numbering.join('-') }
                        className={ hnames[n.depth] + 'Num' }
                    >
                        { n.numbering.join('.')+'.' }
                    </HashLink>
                }
                { [ React.createElement( htags[n.depth], { children }) ] }
            </div>
        )
    }
}

const TocRendererFactory = (isManual? : boolean) => {
    return (p: any) => (
        <div className='toc'>
            <div id={ isManual ? 'man-toc-label' : 'toc-label' } className='label'>
                <FormattedMessage id='markdown.contents' />
            </div>
            { p.children }
        </div>
    )
}

export { TocRendererFactory, TocHeadingRendererFactory, ContentsHeadingRendererFactory };
export default SectionEnumerator;
