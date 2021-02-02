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
        math: (props) => <MathJax.Node formula={props.value} />,
        inlineMath: (props) => <MathJax.Node inline formula={props.value} />
        }
    };
    
    return (
        <MathJax.Provider>
            <ReactMarkdown {...allProps} className='markdown' />
        </MathJax.Provider>
    );
}

export default Markdown;