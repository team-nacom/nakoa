import { GuideType } from 'etc/api';
import React from 'react';
import Exercise from './Exercise';
import MarkdownRenderer from './markdown/MarkdownRenderer';

interface Params {
    guide: GuideType;
}

function GuideView({ guide }: Params) {

    return (
        <div className='guide'>
            <div className='guideBackground' />
            <div className='metadata'> { `${guide.category} > ${guide.section}`} </div>
            <h2 className='subtitle'> { guide.authors ? guide.authors.join(', ') : 'junie' } </h2>
            <h1 className='title'> { guide.name } </h1>
            <div className='guideContent markdown'>
                <MarkdownRenderer>
                    { guide.content }
                </MarkdownRenderer>
            </div>
        </div>
    );
}

export default GuideView;