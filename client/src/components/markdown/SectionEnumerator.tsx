import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

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

function wrapSection(nodes: Node[], depth: Number){
    var stack: Node[] = [];
    while(nodes.length > 0){
        const node = nodes.pop();
        if(node){
            stack.unshift(node);

            if(node.type === 'sectionHeading'
            && Number(node.depth) >= depth
            && Number(node.depth) <= 3){
                nodes.push(
                    {
                        type : 'section',
                        depth : Number(node.depth),
                        priority : node.priority,
                        numbering : node.numbering,
                        children : stack
                    } as Node
                )
                stack = [];

                if(Number(node.depth) === depth) break;
            }

        }
    }
    if(nodes.length === 0){
        nodes = stack.concat(nodes);
    }

    return nodes;
}

const SectionEnumerator : Plugin = (settings) => {
    const sectionEnumerator : Transformer = (tree, file) => {
        let sectionNum = 0, subsectionNum = 0, subsubsectionNum = 0;
        
        const root = tree as Parent;
        const tocList : Node[] = [];

        // wrap section block and enumerate.
        var newChildren: Node[] = [];
        for(const node of root.children){
            node.numbering = [] as Number[];

            if(node.type === 'heading'){
                node.type = 'sectionHeading';
                if (node.depth === 1){ //section
                    newChildren = wrapSection(newChildren, 1);

                    if(node.priority !== -1){
                        sectionNum += 1;
                        node.numbering = [sectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                    subsectionNum = 0;
                    subsubsectionNum = 0;
                } else if (node.depth === 2){ //subsection
                    newChildren = wrapSection(newChildren, 2);

                    if(node.priority !== -1){
                        subsectionNum += 1;
                        node.numbering = [sectionNum,subsectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                    subsubsectionNum = 0;
                } else if (node.depth === 3){ //subsubsection
                    newChildren = wrapSection(newChildren, 3);

                    if(node.priority !== -1){
                        subsubsectionNum += 1;
                        node.numbering = [sectionNum,subsectionNum,subsubsectionNum];
                        tocList.push( tocHeadingCopy(node) );
                    }
                }
            }

            newChildren.push(node);
        }

        if(sectionNum > 0){
            newChildren = wrapSection(newChildren, 1);
        } else if(subsectionNum > 0){
            newChildren = wrapSection(newChildren, 2);
        } else if(subsubsectionNum > 0){
            newChildren = wrapSection(newChildren, 3);
        }

        if(!(settings?.noTOC)){
            root.children = [{ type: 'toc', children: tocList } as Node].concat(newChildren);
        }
    }

    return sectionEnumerator;
}


const hnames = [ 'NA', 'section', 'subsection', 'subsubsection', 'h4', 'h5', 'h6' ];

const htags = [ 'div', 'h2', 'h3', 'h4', 'h5', 'h6', 'h6' ]; // can be 'h1', 'h2', ...

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

const SectionRendererFactory = (isManual? : boolean, usePriority? : boolean) => {
    return (n : any) => {
        return (
            <div className={ 'sectionBlock ' + (usePriority ? priorityTags[n.priority] : '') }>
                { n.children }
            </div>
        )
    }
}

const SectionHeadingRendererFactory = (isManual? : boolean, usePriority? : boolean) => {
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
            <div className={ 'headingBlock ' + hnames[n.depth] }>
                { usePriority && n.priority !== -1 &&
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

export { TocRendererFactory, TocHeadingRendererFactory, SectionRendererFactory, SectionHeadingRendererFactory };
export default SectionEnumerator;
