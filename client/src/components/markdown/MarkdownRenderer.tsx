import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'unified';

import gfm from 'remark-gfm';
import Math from 'remark-math';
import CodeFrontmatter from 'remark-code-frontmatter';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import highlighter from 'remark-highlight.js';

import SectionEnumerator, { SectionRenderer } from './SectionEnumerator';

function MarkdownRenderer(props : ReactMarkdown.ReactMarkdownProps) {
    const plugins : PluggableList = [
        gfm,
        Math,
        CodeFrontmatter,

        // custom plugins
        SectionEnumerator,
    ]

    const renderers = {
        math: (p: any) => <TeX block math = { p.value } />,
        inlineMath: (p: any) => <TeX math = { p.value } />,
        // code: ({language, value}) => {
        //     try{
        //         return <SyntaxHighlighter language={ language }>{ value }</SyntaxHighlighter>; //style={ dark }
        //     } catch (error){
        //         return <></>;
        //     }
        // }
        section: SectionRenderer,
        // heading: SectionRenderer,
        toc: (p: any) => (
            <div className='toc box'>
                <div className='label'> Contents </div>
                { p.children }
            </div>
        ),
        root: (p: any) => (
            <>
                { p.children[0] }
                <div className='blog-preview'>
                    { p.children.slice(1) }
                </div>
            </>
        ),
    }
    
    return (
        <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
    );
}

export default MarkdownRenderer;