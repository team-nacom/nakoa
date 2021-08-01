import Footer from 'components/Footer';
import GuideSidebar from 'components/GuideSidebar';
import Header from 'components/Header';
import { CateType, getCateDetail, getCates, getGoryDetail, GoryType } from 'etc/api/category';
import { getGuideCategories, getGuides, getGuideSections, GuideType, priorityTags } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

interface GoryViewProps {
    index: number;
    gory: GoryType;
};

function GoryView({ index, gory } : GoryViewProps) {
    let [isCollapsed, setIsCollapsed] = React.useState(true);
    let [goryDetailLoading, goryDetail] = usePromise(() => getGoryDetail(gory.index));

    if (goryDetailLoading) return <></>;
    return (
        <>
            <div className='guideListItemContainer link'>
                <div className='guideListSection' onClick={(e) => { e.preventDefault(); setIsCollapsed(!isCollapsed); }}>
                    <span className='index'> { index } </span>
                    <span className='title'>  { gory.name } </span>
                    <span className='collapseButton material-icons'> { isCollapsed ? 'expand_more' : 'expand_less' } </span>
                </div>
                { !isCollapsed && goryDetail.guides.map((guide) => (
                    <Link to={`/guide/${guide.index}`}>
                        <div className='guideListItem'>
                            <span className='title'> { guide.name } </span>
                            <span className='priority'> { priorityTags[guide.priority] } </span>
                        </div>
                    </Link> 
                ))}
            </div>
        </>
    )
}

interface CateViewProps {
    cate: CateType;
}

function CateView({ cate } : CateViewProps) {
    let [cateDetailLoading, cateDetail] = usePromise(() => getCateDetail(cate.index));

    if (cateDetailLoading) return <></>;
    else return (
        <div key={cate.name} className='guideList'>
            <h1> { cate.name || '분류되지 않음' } </h1>
            <div className='guideListContainer'>
                { 
                    cateDetail.gories.map((gory, k) => <GoryView gory={gory} index={k+1} />)
                }
            </div>
        </div>
    );
}

function GuideList() {
    let isAdmin = useIsAdmin();

    let [catesLoading, cates] = usePromise(getCates);

    if (catesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' />
            <GuideSidebar on='list'>
                { isAdmin && (
                    <span>
                        <Link to='/guide/write'>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
            { cates.map((cate) => <CateView cate={cate} />) }
            <Footer/>
        </>
    );
}

export default GuideList;