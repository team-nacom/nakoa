import { getCateDetail, getCates, getGoryDetail } from 'etc/api/category';
import { GuideFilterType, GuideType, defaultGuideFilter } from 'etc/api/guide';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import MarkdownRenderer from './markdown/MarkdownRenderer';

interface GuideNavigateBarProps {
    guideIndex: number;
    guides: GuideType[] | undefined;
}

function GuideNavigateBar({ guideIndex, guides } : GuideNavigateBarProps) {
    let guideOrder = React.useMemo(() => {
        if (!guides) return undefined;
        let order = guides.findIndex((guide) => guide.index === guideIndex);

        if (order === -1) return undefined;
        return order;
    }, [guideIndex, guides]);

    let befGuide = React.useMemo(() => {
        if (!guides || guideOrder === undefined || guideOrder === 0) return undefined;
        return guides[guideOrder-1];
    }, [guides, guideOrder]);

    let nxtGuide = React.useMemo(() => {
        if (!guides || guideOrder === undefined || guideOrder === guides.length - 1) return undefined;
        return guides[guideOrder+1];
    }, [guides, guideOrder]);

    return (
        <h3 className='guideNavigateBar'>
            { befGuide && (
                <Link to={`/guide/${befGuide.index}`} className='guideNavigateLeft'>
                    <span className='material-icons'> navigate_before </span>
                    <span className='guideNavigateItemName'> { befGuide.name } </span>
                </Link> 
            )}
            { nxtGuide && (
                <Link to={`/guide/${nxtGuide.index}`} className='guideNavigateRight'>
                    <span className='guideNavigateItemName'> { nxtGuide.name } </span> 
                    <span className='material-icons'> navigate_next </span>
                </Link>
            )}
        </h3>
    )
}


interface Params {
    guide: GuideType;
    filter?: GuideFilterType;
}

function GuideView({ guide, filter = defaultGuideFilter }: Params) {
    let [catesLoading, cates] = usePromise(() => getCates());
    let [cateDetailLoading, cate] = usePromise(() => getCateDetail(guide.cate), [guide]);
    let [goryDetailLoading, gory] = usePromise(() => getGoryDetail(guide.gory), [guide]);
    let [redirectTo, setRedirectTo] = React.useState<string>();

    if (redirectTo) return <Redirect push to={redirectTo}/>
    else return (
        <div className='guide'>
            <div className='guideBackground' />
            <div className='metadata'> 
                <select className='metadataItem' value={ guide.cate } onChange={(e) => setRedirectTo(`/guide?cate=${e.target.value}`)}> 
                    { cates?.map((cate) => (
                        <option value={cate.index}> { cate.name } </option>
                    )) } 
                </select>
                <span> { '>' } </span> 
                <select className='metadataItem' value={ guide.gory } onChange={(e) => setRedirectTo(`/guide?cate=${guide.cate}&gory=${e.target.value}`)}> 
                    { cate?.gories.map((gory) => (
                        <option value={gory.index}> { gory.name } </option>
                    )) } 
                </select>
            </div>
            <h2 className='subtitle'> { guide.authors ? guide.authors.join(', ') : 'junie' } </h2>
            <h1 className='title'> { guide.name } </h1>
            <GuideNavigateBar guideIndex={guide.index!} guides={gory?.guides} />
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
            <GuideNavigateBar guideIndex={guide.index!} guides={gory?.guides} />
        </div>
    );
}

export default GuideView;