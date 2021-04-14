import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'unified';
import { Node, Parent } from 'unist';

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

import DirectiveHandler, { TextDirectives, LeafDirectives, ContainerDirectives } from './DirectiveHandler';
import SectionEnumerator, { SectionRenderer } from './SectionEnumerator';

type Renderer = (p: Node) => JSX.Element; //can't we use ReactMarkdown.Renderer or something similar?

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

    const renderers : {[nodeType: string]: Renderer}
    & Record<TextDirectives | LeafDirectives | ContainerDirectives, Renderer> = {
        math: (p: Node) => <TeX block math = { p.value as string } />,
        inlineMath: (p: Node) => <TeX math = { p.value as string } />,
        // code: ({language, value}) => {
        //     try{
        //         return <SyntaxHighlighter language={ language }>{ value }</SyntaxHighlighter>; //style={ dark }
        //     } catch (error){
        //         return <></>;
        //     }
        // }
        root: (p: Node) => (
            <>
                { (p as Parent).children[0] }
                <div className='blog-preview'>
                    { (p as Parent).children.slice(1) }
                </div>
            </>
        ),
        toc: (p: Node) => (
            <div className='toc box'>
                <div className='label'> Contents </div>
                { (p as Parent).children }
            </div>
        ),
        section: SectionRenderer,

        //where is the footnote renderer?

        //handled directives
        exercise: (p: Node) => {
            var n = p as any;
            return (
                <div className='exercise'>
                    <span className='label'>연습문제 { n.attributes.id }</span> <br />

                    연습문제를 표시해 줍니다! <br />
                    안타깝게도, 지금은 연습문제 로드가 구현이 안 돼 있네요... 그래서 대체 텍스트를 집어넣었습니다!
                </div>
            );
        },

        expand: (p: Node) => {
            var summary = (p as Parent).children[0];
            var children = (p as Parent).children.slice(1);

            return (
                <details>
                    <summary>{ summary }</summary>
                    { children }
                </details>
            );
        },

        //unhandled directives
        textDirective: (p: Node) => { return (<></>); },
        leafDirective: (p: Node) => { return (<></>); },
        containerDirective: (p: Node) => {
            return (
                <div style={ {border:'1px solid black', minHeight:'15px'} }>
                    { (p as Parent).children }
                </div>
            );
        }
    }
    
    return (
        <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
    );
}

export default MarkdownRenderer;