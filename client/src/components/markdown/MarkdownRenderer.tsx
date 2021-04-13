import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'unified';

import GFM from 'remark-gfm';
import Math from 'remark-math';
import Footnotes from 'remark-footnotes';
import Directive from 'remark-directive';
import CodeFrontmatter from 'remark-code-frontmatter';

import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// import highlighter from 'remark-highlight.js';

import DirectiveHandler from './DirectiveHandler';
import SectionEnumerator, { SectionRenderer } from './SectionEnumerator';

function MarkdownRenderer(props : ReactMarkdown.ReactMarkdownProps) {
    const plugins : PluggableList = [
        GFM,
        Math,
        // Footnotes, // where is the renderer?
        Directive,
        CodeFrontmatter,

        // custom plugins
        DirectiveHandler,
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
        root: (p: any) => (
            <>
                { p.children[0] }
                <div className='blog-preview'>
                    { p.children.slice(1) }
                </div>
            </>
        ),
        toc: (p: any) => (
            <div className='toc box'>
                <div className='label'> Contents </div>
                { p.children }
            </div>
        ),
        section: SectionRenderer,

        //where is the footnote renderer?

        //handled directives
        exercise: (p: any) => {
            var n = p;
            return (
                <div className='exercise'>
                    <span className='label'>연습문제 { n.attributes.id }</span> <br />

                    연습문제를 표시해 줍니다! <br />
                    안타깝게도, 지금은 연습문제 로드가 구현이 안 돼 있네요... 그래서 대체 텍스트를 집어넣었습니다!
                </div>
            );
        },

        expand: (p: any) => {
            var n = p;
            var summary = n.children[0];
            var children = n.children.slice(1);

            return (
                <details>
                    <summary>{ summary }</summary>
                    { children }
                </details>
            );
        },

        //unhandled directives
        textDirective: (p: any) => { return (<></>); },
        leafDirective: (p: any) => { return (<></>); },
        containerDirective: (p: any) => {
            var n = p;

            return (
                <div style={ {border:'1px solid black', minHeight:'15px'} }>
                    { n.children }
                </div>
            );
        }
    }
    
    return (
        <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
    );
}

export default MarkdownRenderer;