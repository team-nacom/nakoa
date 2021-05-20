import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';
import visit from 'unist-util-visit';

import ReactMarkdown from 'react-markdown';
import Math from 'remark-math';
import TeX from '@matejmazur/react-katex';

import { HashLink } from 'react-router-hash-link';

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

const SectionEnumerator : Plugin = () => {
    const sectionEnumerator : Transformer = (tree, file) => {
        let sectionNum = 0, subsectionNum = 0, subsubsectionNum = 0;
        
        const root = tree as Parent;
        const tocList : Node[] = [];

        for(const child of root.children){
            switch(child.type){
            case 'heading':
                child.type = 'section';
                child.numbering = [];

                // skip unnumbered(priority -1)
                if(child.data?.priority === -1){
                    continue;
                }

                if (child.depth === 1){ //section
                    sectionNum += 1;
                    subsectionNum = 0;
                    subsubsectionNum = 0;

                    child.numbering = [sectionNum];

                    tocList.push( nodeDeepCopy(child) );
                } else if (child.depth === 2){ //subsection
                    subsectionNum += 1;
                    subsubsectionNum = 0;

                    child.numbering = [sectionNum, subsectionNum];

                    tocList.push( nodeDeepCopy(child) );
                } else if (child.depth === 3){ //subsubsection
                    subsubsectionNum += 1;

                    child.numbering = [sectionNum, subsectionNum, subsubsectionNum];

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

    const priorityTags = ['','Essential','Recommendable','Readable','Optional','Draft'];

    var n = p;

    if(n.copied){ //toc
        return (        
            <div className={ hnames[n.depth] }>
                { n.data.priority !== -1 &&
                    <HashLink
                        to={ '#heading-'+n.numbering.join('-') }
                        className={ hnames[n.depth] + 'Num' }
                    >
                        { n.numbering.join('.')+'.' }
                    </HashLink>
                }
                {/* <div className={ hnames[n.depth] + 'Num' }>
                    { n.numbering.join('.') }
                </div> */}
                { [ React.createElement( htags[n.depth], {children: n.children}) ] }
            </div>
        )
    }
    else{ //contents
        return (        
            <div className={ hnames[n.depth] }>
                { n.data.priority !== -1 &&
                    <HashLink
                        to='#toc-label' id={ 'heading-'+n.numbering.join('-') }
                        className={ hnames[n.depth] + 'Num' }
                    >
                        { n.numbering.join('.')+'.' }
                    </HashLink>
                }
                { [ React.createElement( htags[n.depth], {children: n.children}) ] }
                <span style={ {fontSize:'10px'} }>
                    { priorityTags[n.data.priority] }
                </span>
            </div>
        )
    }
}

const SectionRendererFactory = (isManual? : boolean) => {
    return (n : any) => {
        const hnames = [ 'NA', 'section', 'subsection', 'subsubsection', 'h4', 'h5', 'h6' ];

        const htags = [ 'div', 'h2', 'h3', 'h4', 'h5', 'h6', 'h6' ]; // can be 'h1', 'h2', ...

        const priorityTags = ['','Essential','Recommendable','Readable','Optional','Draft'];

        if(n.copied){ //toc
            return (        
                <div className={ hnames[n.depth] }>
                    { n.data.priority !== -1 &&
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
        else{ //contents
            return (        
                <div className={ hnames[n.depth] }>
                    { n.data.priority !== -1 &&
                        <HashLink
                            to={ (isManual ? '#man-':'#') + 'toc-label' }
                            id={ (isManual ? 'man-':'') + 'heading-' + n.numbering.join('-') }
                            className={ hnames[n.depth] + 'Num' }
                        >
                            { n.numbering.join('.')+'.' }
                        </HashLink>
                    }
                    { [ React.createElement( htags[n.depth], {children: n.children}) ] }
                    {
                        !isManual &&
                        <span style={ {fontSize:'10px'} }>
                            { priorityTags[n.data.priority] }
                        </span>
                    }
                </div>
            )
        }
    }
}

const TocRendererFactory = (isManual? : boolean) => {
    return (p: any) => (
        <div className='toc'>
            <div id={ isManual ? 'man-toc-label' : 'toc-label' } className='label'> Contents </div>
            { p.children }
        </div>
    )
}

export { SectionRenderer, SectionRendererFactory, TocRendererFactory };
export default SectionEnumerator;
