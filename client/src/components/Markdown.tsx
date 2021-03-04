import React from 'react';
import { MathJaxProvider, Tex2SVG } from 'react-hook-mathjax';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import RemarkMathPlugin from 'remark-math';

function Markdown(props : any) {
    const allProps: ReactMarkdown.ReactMarkdownProps = {
        ...props,
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            ...props.renderers,
            math: (props) => <Tex2SVG display='inline' latex={props.value}/>,
            inlineMath: (props) => <Tex2SVG display='inline' latex={props.value}/>,
        }
    };
    
    return (
        <MathJaxProvider>
            <ReactMarkdown {...allProps} className='markdown'/>
        </MathJaxProvider>
    );
}

export default Markdown;