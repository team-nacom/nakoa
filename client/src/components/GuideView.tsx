import { getGuideCategories, getGuideSections, GuideFilterType, GuideType, positiveGuideFilter } from 'etc/api/guide';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from './markdown/MarkdownRenderer';

interface GuideNavigateBarProps {

}

function GuideNavigateBar({ } : GuideNavigateBarProps) {
    return (
        <h3 className='guideNavigateBar'>
            <Link to='/guide/1' className='guideNavigateLeft'>
                <span className='material-icons'> navigate_before </span>
                <span className='guideNavigateItemName'> 이전 글 제목 </span>
            </Link>
            <Link to='/guide/3' className='guideNavigateRight'>
                <span className='guideNavigateItemName'> 다음 글 제목 </span> 
                <span className='material-icons'> navigate_next </span>
            </Link>
        </h3>
    )
}


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
            <GuideNavigateBar />
            <div className='guideContent'>
                <MarkdownRenderer>
                    { guide.content }
                </MarkdownRenderer>
            </div>
            <GuideNavigateBar />
        </div>
    );
}

export default GuideView;