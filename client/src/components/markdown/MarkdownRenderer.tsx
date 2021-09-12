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

import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
// import 'react-highlight.js/node_modules/highlight.js/styles/github.css';

import DirectiveHandler, { TextDirectives, LeafDirectives, ContainerDirectives } from './DirectiveHandler';
import SectionEnumerator, { TocRendererFactory, TocHeadingRendererFactory, SectionRendererFactory, SectionHeadingRendererFactory } from './SectionEnumerator';
import SectionPriorityHandler from './SectionPriorityHandler';
import InternalLinkHandler from './InternalLinkHandler';

import FootnoteEnumerator, { FootnoteDefinitionRenderer, FootnoteReferenceRenderer } from './FootnoteEnumerator';

import NaMark from '../namark'

type Renderer = (p: Node) => JSX.Element; //can't we use ReactMarkdown.Renderer or something similar?

interface RendererOptionProps{
    isManual?: boolean
}

function MarkdownRenderer(props : ReactMarkdown.ReactMarkdownProps & RendererOptionProps) {
    const plugins : PluggableList = [
        GFM,
        Math,
        [Footnotes, {inlineNotes: true}],
        Directive,
        CodeFrontmatter,

        // custom plugins
        NaMark,

        SectionPriorityHandler,
        InternalLinkHandler,
        DirectiveHandler,
        SectionEnumerator,
        FootnoteEnumerator,
    ]

    const renderers : {[nodeType: string]: Renderer}
    & Record<TextDirectives | LeafDirectives | ContainerDirectives, Renderer> = {
        root: (p: any) => (
            <>
                { p.children[0] }
                <div className='markdown'>
                    { p.children.slice(1) }
                </div>
            </>
        ),

        //toc renderers
        toc: TocRendererFactory(props.isManual),
        tocHeading : TocHeadingRendererFactory(props.isManual),

        //section renderers
        section: SectionRendererFactory(props.isManual),
        sectionHeading: SectionHeadingRendererFactory(props.isManual),

        //footnote renderers
        footnoteReference: FootnoteReferenceRenderer,
        footnoteDefinition: FootnoteDefinitionRenderer,
        footnoteList: (p: any) => ( p.children.length ?
                <div className='footnoteContainer'>
                    <hr/>
                    <div> { p.children } </div>
                </div>
            : (<></>)
        ),

        math: (p: any) => <TeX block math = { p.value as string } />,
        inlineMath: (p: any) => <TeX math = { p.value as string } />,
        code: (p: any) => { // ({language, value}) => {
            if(!p.language){
                return (
                    <pre>
                        <code>{ p.value }</code>
                    </pre>
                );
            }
            return ( 
                <Highlight className = { p.language } >
                    { p.value }
                </Highlight>
            ); 
        },
        // inlineCode: ???

        intLink: (p: any) =>{
            return(
                <a href={ '/'+ p.for + '/' + p.target }>
                    { '🔗' }
                    { p.children }
                </a>
            );
        },

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
        },
        textbox: (p: any) => {
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
            (error: Error) => { console.log(error) } // may do some error handling
        } resetKeys={[props.children]} >
            <ReactMarkdown {...props} plugins = { plugins } renderers = { renderers } className='markdown'/>
        </ErrorBoundary>
    );
}

export default MarkdownRenderer;