import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'unified';
import { Node, Parent } from 'unist';

import { FallbackProps, ErrorBoundary } from 'react-error-boundary';

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
import UnnumberedSectionHandler from './UnnumberedSectionHandler';

import FootnoteEnumerator, { FootnoteDefinitionRenderer, FootnoteReferenceRenderer } from './FootnoteEnumerator';

type Renderer = (p: Node) => JSX.Element; //can't we use ReactMarkdown.Renderer or something similar?

function MarkdownRenderer(props : ReactMarkdown.ReactMarkdownProps) {
    const plugins : PluggableList = [
        GFM,
        Math,
        [Footnotes, {inlineNotes: true}],
        Directive,
        CodeFrontmatter,

        // custom plugins
        UnnumberedSectionHandler,
        DirectiveHandler,
        SectionEnumerator,
        FootnoteEnumerator,
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

        //footnote renderers
        footnoteReference: FootnoteReferenceRenderer,
        footnoteDefinition: FootnoteDefinitionRenderer,
        footnoteList: (p: any) => (
            <div className='footnoteList'>
                <hr />
                <ol>
                    { p.children }
                </ol>
            </div>
        ),

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
                <div className='exercise box'>
                    <div className='label'>연습문제 { label }</div>
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
                    <div>
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
                <div className='textframe' >
                    { p.children }
                </div>
            );
        }
    }

    return (
        <ErrorBoundary FallbackComponent = { ({error, resetErrorBoundary}) => (
            <div role='alert'>
                <p>렌더링 실패, 다시 시도해 보세요.</p>
            </div>
        ) } onError = {
            (error: Error) => { } // may do some error handling
        } resetKeys={[props.children]} >
            <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
        </ErrorBoundary>
    );
}

export default MarkdownRenderer;