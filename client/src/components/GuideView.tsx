import { getGuideCategories, getGuideSections, GuideFilterType, GuideType, positiveGuideFilter } from 'etc/api/guide';
import usePromise from 'etc/usePromise';
import React from 'react';
import MarkdownRenderer from './markdown/MarkdownRenderer';

interface Params {
    guide: GuideType;
    filter?: GuideFilterType;
}

function GuideView({ guide, filter = positiveGuideFilter }: Params) {
    let [_, categories] = usePromise(() => getGuideCategories());
    let [__, sections] = usePromise(() => getGuideSections(guide.category), [guide]);

    return (
        <div className='guide'>
            <div className='guideBackground' />
            <div className='metadata'> 
                <select className='metadataItem' value={ guide.category }> 
                    { (categories || [guide.category]).map((category) => (
                        <option value={category}> { category } </option>
                    )) } 
                </select>
                <span> { '>' } </span> 
                <select className='metadataItem' value={ guide.category }> 
                    { (sections || [guide.section]).map((section) => (
                        <option value={section}> { section } </option>
                    )) } 
                </select>
            </div>
            <h2 className='subtitle'> { guide.authors ? guide.authors.join(', ') : 'junie' } </h2>
            <h1 className='title'> { guide.name } </h1>
            <div className='guideContent'>
                <MarkdownRenderer>
                    { guide.content }
                </MarkdownRenderer>
            </div>
        </div>
    );
}

export default GuideView;