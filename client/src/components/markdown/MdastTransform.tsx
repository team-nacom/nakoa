import React, { useState, useEffect, PropsWithChildren } from 'react'
import isEqual from 'react-fast-compare'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import {normalizeUri} from 'micromark-util-sanitize-uri'

import 'katex/dist/katex.min.css';
import katex from 'katex'
import { getImageUrl, resolveImageUrl } from '#/api/file';

export type Handler = React.ComponentType<PropsWithChildren<any>>

export interface Handlers{
    [mdastType: string]: Handler
}

// default handlers equivalent to https://github.com/syntax-tree/mdast-util-to-hast/tree/main/lib/handlers
const defaultHandlers: Handlers = {
    'root': ({ children, ...props }) => (<>{ children }</>),
    'text': ({ children, ...props }) => (<>{ props.value }</>),

    'html': ({ children, ...props }) => (<></>),

    'break': ({ children, ...props }) => (<br />),
    'thematicBreak': ({ children, ...props }) => (<hr />),

    'blockquote': ({ children, ...props }) => (<blockquote>{ children }</blockquote>),
    'delete': ({ children, ...props }) => (<del>{ children }</del>),
    'emphasis': ({ children, ...props }) => (<em>{ children }</em>),
    'paragraph': ({ children, ...props }) => (<p>{ children }</p>),
    'strong': ({ children, ...props }) => (<strong>{ children }</strong>),
    
    'code': ({ children, ...props }) => {
        return (
            <SyntaxHighlighter className='code'
                language = { props.lang }
                style = { docco }
                wrapLongLines = { true }
            >
                {props.value}
            </SyntaxHighlighter>
        )
    },
    'inlineCode': ({ children, ...props }) => {
        return <code>
            { (props.value ?? '').replace(/\r?\n|\r/g, ' ') }
        </code>
    },
    
    // no footnote-reference, footnote, image-reference, link-reference, ...
    'heading': ({ children, ...props }) => {
        let depth = Number(props.depth)
        if(isNaN(depth) || [1,2,3,4,5,6].indexOf(depth) === -1) depth = 1

        const Tag = ('h' + depth) as keyof JSX.IntrinsicElements
        return <Tag>{ children }</Tag>
    },
    
    'image': function ImageTransform({ children, ...props }){
        const [url, setUrl] = useState('');

        useEffect(() => {
            resolveImageUrl(props.url).then( setUrl );
        }, [props.url]);

        return <img src={ url } alt={ props.alt } title={ props.title ?? '' } />
    },
    
    'link': ({ children, ...props }) => {
        return <a href={ normalizeUri(props.url) } title={ props.title ?? '' }>{ children }</a>
    },

    'list': ({ children, ...props }) => {
        const List = (props.ordered ? 'ol' : 'ul') as keyof JSX.IntrinsicElements
        let start = Number(props.start)
        if(isNaN(start) || start < 0) start = 1

        return <List start={ start }>
            { children }
        </List>
    },
    'listItem': ({ children, ...props }) => {
        const checkbox = (typeof props.checked === 'boolean')
        
        return <li className={ checkbox ? 'task-list-item':'' } >
            {checkbox &&
                <input type='checkbox' checked={ props.checked } disabled={ true } />
            }
            { children }
        </li>
    },

    'table': ({ children, ...props }) => (<table>{ children }</table>),
    'tableHead': ({ children, ...props }) => (<thead>{ children }</thead>),
    'tableBody': ({ children, ...props }) => (<tbody>{ children }</tbody>),
    'tableRow': ({ children, ...props }) => (<tr>{ children }</tr>),
    'tableCell': ({ children, ...props }) => {
        const Elem = (props.isHeader ? 'th' : 'td') as keyof JSX.IntrinsicElements
        const style = props.align ? {textAlign: props.align} : undefined

        return <Elem style={style}>{ children }</Elem>
    },

    'math': ({ children, ...props }) => {
        const innerHtml = katex.renderToString(props.value, {
            displayMode: true,
            throwOnError: false,
            macros: {}
        })
        return <div className='math-display'
            dangerouslySetInnerHTML={ { __html: innerHtml } }
        />
    },
    'inlineMath': ({ children, ...props }) => {
        const innerHtml = katex.renderToString(props.value, {
            displayMode: false,
            throwOnError: false,
            macros: {}
        })
        return <span className='math-inline'
            dangerouslySetInnerHTML={ { __html: innerHtml } }
        />
    }
    
}

interface InnerMdastTransformProps{
    node: any,
    handlers: Handlers
}
function _InnerMdastTransform({ node, handlers }: InnerMdastTransformProps){
    const { type, children, position, ...props } = (node ?? {})

    // if(!type){
    //     throw new Error('Expected node, got `' + node + '`')
    // }
    
    const Fn : Handler = handlers[type] ?? (()=><></>)

    return <Fn {...props}>
        { (children as any[] ?? []).map((child, idx) => <InnerMdastTransform key={ idx } node={ child } handlers={ handlers } />) }
    </Fn>
}
const InnerMdastTransform = React.memo(_InnerMdastTransform, isEqual)


interface MdastTransformProps{
    node: any,
    customHandlers: Handlers
}
function MdastTransform({node: tree, customHandlers}: MdastTransformProps){
    const handlers = React.useMemo(()=>{
        return {...defaultHandlers, ...customHandlers}
    }, [customHandlers])

    return <InnerMdastTransform node={ tree } handlers={ handlers } />
}


export { MdastTransform }