import React from 'react';
import { MathJaxProvider, Tex2SVG } from 'react-hook-mathjax';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import Math from 'remark-math';
import CodeFrontmatter from 'remark-code-frontmatter';

function Markdown(props : any) {
    const allProps: ReactMarkdown.ReactMarkdownProps = {
        ...props,
        plugins: [
            Math,
            CodeFrontmatter,
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