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
        math: (p: any) => <TeX block math = { p.value as string } />,
        inlineMath: (p: any) => <TeX math = { p.value as string } />,
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
            var label : any = '';
            var children = p.children;

            var c = children[0];
            if(c?.props?.data?.directiveLabel){
                label = c.props.children;
                children = children.slice(1);
            }

            return (
                <div className='exercise'>
                    <span className='label'>연습문제 { label }</span> <br />
                    { children }
                </div>
            );
        },
        expand: (p: any) => {
            var label : any = '';
            var children = p.children;

            var c = children[0];
            if(c?.props?.data?.directiveLabel){
                label = c.props.children;
                children = children.slice(1);
            }

            return (
                <details>
                    <summary>{ label }</summary>
                    <div style={ {marginLeft:'10px'} }>
                        { children }
                    </div>
                </details>
            );
        },

        //unhandled directives
        textDirective: (p: any) => {
            return (<>:{ p.name }{ p.children[0] ? `[${ p.children[0].props.value }]`:`` }</>);
        },
        leafDirective: (p: any) => { return (<></>); },
        containerDirective: (p: any) => {
            return (
                <div style={ {border:'1px solid black', minHeight:'15px'} }>
                    { p.children }
                </div>
            );
        }
    }
    
    return (
        <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
    );
}

export default MarkdownRenderer;