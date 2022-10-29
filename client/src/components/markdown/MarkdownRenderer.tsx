import React, { useMemo, PropsWithChildren } from 'react';
import { FallbackProps, ErrorBoundary } from 'react-error-boundary';

import isEqual from 'react-fast-compare'

import { PluggableList } from 'unified';
import { Node, Parent } from 'unist';
import { u } from 'unist-builder';
import { remove } from 'unist-util-remove';

import { Root as MdastRoot, Parent as MdastParent } from 'mdast';
import { H, Handler, Handlers } from 'mdast-util-to-hast';
import { all } from 'mdast-util-to-hast/lib/traverse'

import ReactMarkdown, { Options } from 'react-markdown';
import { Remark } from 'react-remark'

import RemarkGFM from 'remark-gfm';
import RemarkMath from 'remark-math';
import RemarkFootnotes from 'remark-footnotes';
import CodeFrontmatter from 'remark-code-frontmatter';

import 'katex/dist/katex.min.css';
import RehypeKatex from 'rehype-katex';

// import TeX from '@matejmazur/react-katex';

import 'highlight.js/styles/github.css';
// import 'react-highlight.js/node_modules/highlight.js/styles/github.css';

// import SectionEnumerator, { TocRendererFactory, TocHeadingRendererFactory, SectionRendererFactory, SectionHeadingRendererFactory } from './plugins/SectionEnumerator';
import InternalLinkHandler from './InternalLinkHandler';
// import FootnoteEnumerator, { FootnoteDefinitionRenderer, FootnoteReferenceRenderer } from './FootnoteEnumerator';
import NamarkPerref from './plugins/perref';
// import { NamarkTextbox, NamarkTextboxToHast } from './plugins/textbox';
import namarkNaHeading from './plugins/naheading';

// type MdastNode = MdastRoot | MdastParent['children'][number];

// type ToComponent = (p: Node) => JSX.Element;

interface RendererOptionProps{
    isManual?: boolean,
    usePriority?: boolean,
    useTOC?: boolean,
    openDetails?: boolean,

    inlineRenderPrefix?: string, // if rendered inline, set prefix before it.
    inlineRenderClassName?: string,

    mathMacroObj?: Object,
    perrefMap?: Record<string, string | number[]>

    children: string
}

function MarkdownRenderer(props : RendererOptionProps) {
    //TODO : TOC
    //TODO : priority heading
    //TODO : SECTION (part of bubble?)
    //TODO : FOOTNOTE

    //remark plugins(constructing & manipulating mdast)
    const remarkPlugins : PluggableList = useMemo(() => [
        RemarkGFM,
        RemarkMath,
        [RemarkFootnotes, {inlineNotes: true}],

        /////// custom plugins for parsing
        // NamarkTextbox,
        // namarkNaHeading,

        /////// manipulations
        // [NamarkPerref, { map: props.perrefMap }],
        InternalLinkHandler,
        // ...( props.useTOC ? [SectionEnumerator] : [] ),
        // FootnoteEnumerator,

        // Inline Render
        // discard parent cell except one.
        () => ( (tree: any, file: any) => {
            if(props.inlineRenderPrefix === undefined) return;

            let root = tree as Parent;
            if(root.children && Array.isArray(root.children) && root.children.length > 0){
                let child = root.children[0] as Parent;

                if(props.inlineRenderClassName){
                    child.data = child.data ?? {};
                    child.data['hClassName'] = props.inlineRenderClassName;
                }

                if(child.children && Array.isArray(child.children)){
                    child.children.unshift(u('text',props.inlineRenderPrefix));
                }

                root.children = [child];
            }
        }),

        // () => ( (tree: any,file: any) => {console.log(tree)} )
    ], [ /* props.perrefMap, */ props.inlineRenderPrefix, props.inlineRenderClassName])

    //remark -> rehype handlers
    const remarkRehypeHandlers : Handlers = {
        // ...NamarkTextboxToHast,
        intLink: (h, node: any) => {
            return h(node, 'a', { href: '/'+ node.for + '/' + node.target },
                [ u('text','🔗'), ...all(h, node)]
            )
        }
    }

    //rehype plugins(manipulating hast)
    const rehypePlugins : PluggableList = useMemo(() => [
        () => ( (tree, file) => {
            remove(tree, (node)=>( node.type === 'text' && node.value === '\n' ))
        } ), //remove unnecessary linefeed(`\n`) wrappers.
        
        [RehypeKatex, {
            macros: props.mathMacroObj,
            globalGroup: true
        }],

        // () => ( (tree: any,file: any) => {console.log(tree)} )
    ], [props.mathMacroObj])

    //HTML components.
    const components = {
        details: (p: any) => {
            let { children, ...others } = p;
            return <details {...others} open={props.openDetails}>
                { p.children }
            </details>;
        }
    }

    // 타입이 잘 안맞는다. remark ecosystem이 워낙 거대해서 dependency version 미스매치가 자주 발생하는 듯.
    // 장기적으로는 line 단위 캐싱을 해야 될 듯 한데 이 경우 remark 의존성을 줄여야 할지도.

    return (
        <ErrorBoundary FallbackComponent = { ({error, resetErrorBoundary}) => (
            <div role='alert'>
                <p>렌더링 실패, 다시 시도해 보세요.</p>
            </div>
        ) } onError = {
            (error: Error) => { console.log(error) } // may do some error handling
        } resetKeys={[props.children]} >
            <ReactMarkdown {...props}
                className={ props.inlineRenderPrefix === undefined ? 'markdown' : undefined }
                remarkPlugins = { remarkPlugins as any }
                remarkRehypeOptions = { {
                    handlers: remarkRehypeHandlers as any
                } }
                rehypePlugins = { rehypePlugins as any }
                components = { components }
            />
        </ErrorBoundary>
    );
}

//memoize by default.
const MemoizedRenderer = React.memo(MarkdownRenderer, isEqual);

export default MemoizedRenderer;