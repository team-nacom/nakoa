import React, { useState, useEffect } from 'react';
import { unified, Processor, PluggableList } from 'unified';
import remarkParse from 'remark-parse';

import RemarkGFM from 'remark-gfm';
import RemarkMath from 'remark-math';

import { MdastTransform, Handlers } from './MdastTransform';
import WrapTableRows from './remark-wrap-table-rows';
import RemovePosition from './remark-remove-position';
import perref from './perref';
import inlineRender from './inline-render';

import InternalLinkHandler from './InternalLinkHandler';

import { resolveUrlWithMap, urlToAttachmentIndex } from '#/api/file-local';

import katex from 'katex';
import usePromise from '#/misc/usePromise';

function customHandlersBuilder(mathMacroObj: Object, fileMap: Record<string, File>): Handlers{
    const macros = {...mathMacroObj};

    return {
        'image': function ImageTransform({ children, ...props }){
            const [loading, url] = usePromise(() => resolveUrlWithMap(props.url, fileMap, true), [props.url, fileMap]);

            if(loading) return null;
            return <img src={ url } alt={ props.alt } title={ props.title } />
        },
        'link': function LinkTransform({ children, ...props }){
            const [loading, url] = usePromise(() => resolveUrlWithMap(props.url, fileMap), [props.url, fileMap]);

            if(loading) return null;

            return <a href={ url } download={ urlToAttachmentIndex(props.url) } /* title={ props.title } */>{ children }</a>
        },
        'math': ({ children, ...props }) => {
            const innerHtml = katex.renderToString(props.value, {
                displayMode: true,
                throwOnError: false,
                macros,
                globalGroup: true
            })
            return <div className='math-display'
                dangerouslySetInnerHTML={ { __html: innerHtml } }
            />
        },
        'inlineMath': ({ children, ...props }) => {
            const innerHtml = katex.renderToString(props.value, {
                displayMode: false,
                throwOnError: false,
                macros,
                globalGroup: true
            })
            return <span className='math-inline'
                dangerouslySetInnerHTML={ { __html: innerHtml } }
            />
        }
    }
}

interface RendererOptionProps{
    mathMacroObj?: Object,
    inlineRenderPrefix?: string,
    perrefMap?: Record<string, number[]>,

    fileMap?: Record<string, File>,
    children: string,
}
function Markdown(props: RendererOptionProps){
    const {
        mathMacroObj,
        inlineRenderPrefix,
        perrefMap,
        fileMap,
        children: contents
    } = props;

    const customHandlers = React.useMemo(()=>{
        return customHandlersBuilder(mathMacroObj ?? {}, fileMap ?? {});
    }, [mathMacroObj, fileMap]);

    // should be memoed?
    const processor = unified()
        .use(remarkParse)
        .use([
            RemarkGFM, WrapTableRows,
            RemarkMath,

            // [inlineRender, { prefix: inlineRenderPrefix } ],
            [perref, { map: perrefMap }],

            RemovePosition
        ])

    const tree = processor.runSync(processor.parse(contents))

    return <div className='markdown'>
        <MdastTransform
            node = { tree }
            customHandlers = { customHandlers }
        />
    </div>
}

export default Markdown