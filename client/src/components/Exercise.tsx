import React from 'react';
import Markdown from './Markdown';






interface Props {
    id: number;
    title?: string;
    content: string;
    answer: string;
}

function Exercise({ id, title, content, answer } : Props) {
    return (
        <div className='exercise'>
            <h1> 
                { `연습문제 ${id} ` }
                { title && <Markdown source={title} />}
            </h1>
            <div> <Markdown source={content}/> </div>
        </div>
    )
}

export default Exercise;