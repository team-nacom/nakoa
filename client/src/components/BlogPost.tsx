import React from 'react';
import Markdown from './Markdown';

function subsection(sectionNum: number, subsectionNum: number, text: string) {
    return (        
        <div className='subsection'>
            <div className='subsectionText'> {`${sectionNum}.${subsectionNum}.`} </div>
            <Markdown source={text} /> 
        </div>
    )
}

function section(sectionNum: number, text: string) {
    return (
        <div className='section'>
            <div className='sectionText'> {`${sectionNum}.`} </div>
            <Markdown source={text} /> 
        </div>
    )
}


interface Params {
    text: string;
}

function BlogPost({ text }: Params) {
    const lines = text.split('\n');

    let sectionNum = 0, subsectionNum = 0;

    let previews : JSX.Element[] = [];
    let components : JSX.Element[] = [];

    let nowLines = '';
    for (let line of lines) {
        if (line.startsWith('##')) {
            let sectionElement : JSX.Element;
            
            if (line.startsWith('###')) {
                subsectionNum += 1;
                sectionElement = subsection(sectionNum, subsectionNum, line);
            }
            else {
                sectionNum += 1;
                subsectionNum = 0;
                sectionElement = section(sectionNum, line);
            }

            components.push(<Markdown source={nowLines}/>);
            nowLines = '';

            previews.push(sectionElement);
            components.push(sectionElement);
        }
        else {
            nowLines = nowLines + line + '\n';
        }
    }
    components.push(<Markdown source={nowLines}/>);

    return (
        <>
            <div className='preview'>
                { previews }
            </div>
            <div className='blog'>
                { components }
            </div>
        </>
    );
}

export default BlogPost;