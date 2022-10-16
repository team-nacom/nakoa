import React from 'react'
import { unified, Processor, PluggableList } from 'unified'
import remarkParse from 'remark-parse'

import RemarkGFM from 'remark-gfm';
import RemarkMath from 'remark-math';

import { MdastTransform, Handlers } from './MdastTransform'
import WrapTableRows from './remark-wrap-table-rows'
import RemovePosition from './remark-remove-position'

import katex from 'katex'

function customHandlersBuilder(mathMacroObj: Object): Handlers{
    return {
        'math': ({ children, ...props }) => {
            const innerHtml = katex.renderToString(props.value, {
                displayMode: true,
                throwOnError: false,
                macros: mathMacroObj
            })
            return <div className='math-display'
                dangerouslySetInnerHTML={ { __html: innerHtml } }
            />
        },
        'inlineMath': ({ children, ...props }) => {
            const innerHtml = katex.renderToString(props.value, {
                displayMode: false,
                throwOnError: false,
                macros: mathMacroObj
            })
            return <span className='math-inline'
                dangerouslySetInnerHTML={ { __html: innerHtml } }
            />
        }
    }
}

interface RendererOptionProps{
    mathMacroObj?: Object,

    children: string
}
function Markdown(props: RendererOptionProps){
    const {
        mathMacroObj,
        children: contents
    } = props

    const customHandlers = React.useMemo(()=>{
        return customHandlersBuilder(mathMacroObj || {})
    }, [mathMacroObj])

    // should be memoed?
    const processor = unified()
        .use(remarkParse)
        .use([
            RemarkGFM, WrapTableRows,
            RemarkMath,

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