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
        <div className='exercise box'>
            <div className='label'>
                { `Exercise ${id}` }
            </div>
            <h1> 
                { title && <Markdown source={title} />}
            </h1>
            <div> <Markdown source={content}/> </div>
        </div>
    )
}

export default Exercise;