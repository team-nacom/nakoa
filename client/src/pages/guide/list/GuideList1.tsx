import Footer from 'components/Footer';
import GuideSidebar from 'components/GuideSidebar';
import Header from 'components/Header';
import { CateType, getCateDetail, getCates, getGoryDetail, GoryType } from 'etc/api/category';
import { getGuides, GuideType, priorityTags } from 'etc/api/guide';
import { useIsLoggedIn } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from 'pages/Loading';
import queryString from 'query-string';


interface GuideViewProps {
    guide: GuideType;
}

function GuideView({ guide } : GuideViewProps) {
    return (
        <div key={guide.name} className='guideFeed'>
            <Link to={`/guide/${guide.index}`}>
                <div 
                    className='guideFeedContent' 
                    style={{backgroundImage: `url(/diuven.jpeg)`, backgroundSize: '100% 100%'}}
                >
                    <div className='author'> { guide.authors[0] } </div>
                    <div className='tags'> { guide.tags && guide.tags.map((s) => `#${s} `) } </div>
                    <div className='title'> { guide.name } </div>
                    <div className='content'> { guide.content.substring(0, 100) } </div>
                </div>
            </Link>
        </div>
    );
}

function GuideList1() {
    let isLoggedIn = useIsLoggedIn();
    
    let [guidesLoading, guides] = usePromise(getGuides);
    
    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' /> 
            <GuideSidebar on='list'>
                { isLoggedIn && (
                    <span>
                        <Link to={'/guide/write'}>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
            <div className='guideFeedList'>
                { guides?.map((guide) => <GuideView guide={guide} />) }
            </div>
            <Footer/>
        </>
    );
}

export default GuideList1;