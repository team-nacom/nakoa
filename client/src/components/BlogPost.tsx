import React from 'react';
import Markdown from './Markdown';

function subsection(sectionNum: number, subsectionNum: number, text: string) {
    return (        
        <div className='blogSubsection'>
            <div className='blogSubsectionText'> {`${sectionNum}.${subsectionNum}.`} </div>
            <Markdown source={text} /> 
        </div>
    )
}

function section(sectionNum: number, text: string) {
    return (
        <div className='blogSection'>
            <div className='blogSectionText'> {`${sectionNum}.`} </div>
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

    const components = lines.map((text) => {
        if (text.startsWith('###')) {
            subsectionNum += 1;
            const res = subsection(sectionNum, subsectionNum, text);
            previews.push(res);
            return res;
        }
        if (text.startsWith('##')) {
            sectionNum += 1;
            subsectionNum = 0;
            const res = section(sectionNum, text);
            previews.push(res);
            return res;
        }
        return <Markdown source={text} />
    });

    return (
        <>
            <div className='preview'>
                <div> 목차 </div>
                { previews }
            </div>
            { components }
        </>
    );
}

export default BlogPost;