import React from 'react';
import ReactMarkdown from 'react-markdown';
import Math from 'remark-math';

import CodeFrontmatter from 'remark-code-frontmatter';

import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';

function Markdown(props : any) {
    const allProps: ReactMarkdown.ReactMarkdownProps = {
        ...props,
        plugins: [
            Math,
            CodeFrontmatter,
        ],
        renderers: {
            ...props.renderers,
            math: (props) => <BlockMath math = { props.value } />,
            inlineMath: (props) => <InlineMath>{ props.value }</InlineMath>,
        }
    };
    
    return (
        <ReactMarkdown {...allProps} className='markdown'/>
    );
}

export default Markdown;