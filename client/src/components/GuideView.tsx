import { getCateDetail, getCates, getGoryDetail } from 'etc/api/category';
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
    let [catesLoading, cates] = usePromise(() => getCates());
    let [cateDetailLoading, cate] = usePromise(() => getCateDetail(guide.cate), [guide]);
    let [goryDetailLoading, gory] = usePromise(() => getGoryDetail(guide.gory), [guide]);

    return (
        <div className='guide'>
            <div className='guideBackground' />
            <div className='metadata'> 
                <select className='metadataItem' value={ guide.cate }> 
                    { cates?.map((cate) => (
                        <option value={cate.index}> { cate.name } </option>
                    )) } 
                </select>
                <span> { '>' } </span> 
                <select className='metadataItem' value={ guide.gory }> 
                    { cate?.gories.map((gory) => (
                        <option value={gory.index}> { gory.name } </option>
                    )) } 
                </select>
            </div>
            <h2 className='subtitle'> { guide.authors ? guide.authors.join(', ') : 'junie' } </h2>
            <h1 className='title'> { guide.name } </h1>
            <GuideNavigateBar />
            <div className={
                'guideContent'
                + (filter.Essential ? '' : ' hideEssential')
                + (filter.Recommendable ? '' : ' hideRecommendable')
                + (filter.Readable ? '' : ' hideReadable')
                + (filter.Optional ? '' : ' hideOptional')
                + (filter.Draft ? '' : ' showDraft')
            }>
                <MarkdownRenderer>
                    { guide.content }
                </MarkdownRenderer>
            </div>
            <GuideNavigateBar />
        </div>
    );
}

export default GuideView;