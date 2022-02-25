import React from 'react';
import { FallbackProps, ErrorBoundary } from 'react-error-boundary';

import { PluggableList } from 'unified';
import { Node, Parent } from 'unist';
import { u } from 'unist-builder';
import { Root as MdastRoot, Parent as MdastParent } from 'mdast';
import { H, Handler, Handlers, all } from 'mdast-util-to-hast';

import ReactMarkdown, { Options } from 'react-markdown';

import RemarkGFM from 'remark-gfm';
import RemarkMath from 'remark-math';
import RemarkFootnotes from 'remark-footnotes';
import CodeFrontmatter from 'remark-code-frontmatter';

import RehypeKatex from 'rehype-katex';


import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
// import 'react-highlight.js/node_modules/highlight.js/styles/github.css';

// import SectionEnumerator, { TocRendererFactory, TocHeadingRendererFactory, SectionRendererFactory, SectionHeadingRendererFactory } from './SectionEnumerator';
import InternalLinkHandler from './InternalLinkHandler';

// import FootnoteEnumerator, { FootnoteDefinitionRenderer, FootnoteReferenceRenderer } from './FootnoteEnumerator';

import { NamarkTextbox, NamarkTextboxToHast } from './textbox';
import namarkNaHeading from './heading';

type MdastNode = MdastRoot | MdastParent['children'][number];

type ToComponent = (p: Node) => JSX.Element;

interface RendererOptionProps{
    isManual?: boolean,
    usePriority?: boolean,
    useTOC?: boolean,
    openDetails?: boolean
}

function MarkdownRenderer(props : Options & RendererOptionProps) {
    //TODO : TOC
    //TODO : priority heading
    //TODO : SECTION (part of bubble?)
    //TODO : FOOTNOTE

    //remark plugins(constructing & manipulating mdast)
    const remarkPlugins : PluggableList = [
        RemarkGFM,
        RemarkMath,
        [RemarkFootnotes, {inlineNotes: true}],

        /////// custom plugins for parsing
        NamarkTextbox,
        namarkNaHeading,

        /////// manipulations
        InternalLinkHandler,
        // ...( props.useTOC ? [SectionEnumerator] : [] ),
        // FootnoteEnumerator,

        // (settings) => ( (tree,file) => {console.log(tree)} )
    ];

    //remark -> rehype handlers (previously renderers)
    const remarkRehypeHandlers : Handlers = {
        ...NamarkTextboxToHast,
        intLink: (h, node) => {
            return h(node, 'a', { href: '/'+ node.for + '/' + node.target },
                [ u('text','🔗'), ...all(h,node)]
            )
        }
    }

    //rehype plugins(manipulating hast)
    const rehypePlugins : PluggableList = [
        [RehypeKatex, {
            macros: {},
            globalGroup: true
        }]
    ];

    //HTML components.
    const components : {[nodeType: string]: ((p: Node) => JSX.Element)} = {
        details: (p: any) => {
            return <details open={props.openDetails}>
                { p.children }
            </details>;
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
            <ReactMarkdown {...props} className='markdown'
                remarkPlugins = { remarkPlugins }
                remarkRehypeOptions = { {
                    handlers: remarkRehypeHandlers
                } }
                rehypePlugins = { rehypePlugins }
                components = { components }
            />
        </ErrorBoundary>
    );
}

export default MarkdownRenderer;