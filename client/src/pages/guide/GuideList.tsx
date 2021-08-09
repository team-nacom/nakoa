import Footer from 'components/Footer';
import GuideSidebar from 'components/GuideSidebar';
import Header from 'components/Header';
import { CateType, getCateDetail, getCates, getGoryDetail, GoryType } from 'etc/api/category';
import { GuideType, priorityTags } from 'etc/api/guide';
import { useIsLoggedIn } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import queryString from 'query-string';
import { useContext } from 'react';


const ListQueryContext = React.createContext<Query>({});

const matchSearch = (guide: GuideType, query: string) => {
    return guide.name.includes(query) 
        || guide.content.includes(query)
        || !guide.authors.every((author) => !author.includes(query));
}

interface GoryViewProps {
    index: number;
    gory: GoryType;
};

function GoryView({ index, gory } : GoryViewProps) {
    let query = useContext(ListQueryContext);
    let [isCollapsed, setIsCollapsed] = React.useState(query.gory === undefined && query.search === undefined);
    let [goryDetailLoading, goryDetail] = usePromise(() => getGoryDetail(gory.index));

    let guides = React.useMemo(() => {
        return goryDetail?.guides.filter((guide) => query.search === undefined || matchSearch(guide, query.search));
    }, [goryDetail, query])

    if (!guides) return <></>;
    return (
        <>
            <div className='guideListItemContainer link'>
                <div className='guideListSection' onClick={(e) => { e.preventDefault(); setIsCollapsed(!isCollapsed); }}>
                    <span className='index'> { index } </span>
                    <span className='title'>  { gory.name } </span>
                    <span className='collapseButton material-icons'> { isCollapsed ? 'expand_more' : 'expand_less' } </span>
                </div>
                { !isCollapsed && guides.map((guide) => (
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

interface Query {
    cate?: string;
    gory?: string;
    search?: string;
}

interface CateViewProps {
    cate: CateType;
}

function CateView({ cate } : CateViewProps) {
    let query = React.useContext(ListQueryContext);
    let [cateDetailLoading, cateDetail] = usePromise(() => getCateDetail(cate.index));

    let gories = React.useMemo(() => {
        return cateDetail?.gories.filter((gory) => query.gory === undefined || query.gory === gory.index);
    }, [cateDetail, query]);

    if (!gories) return <></>;
    return (
        <div key={cate.name} className='guideList'>
            <h1> { cate.name || '분류되지 않음' } </h1>
            <div className='guideListContainer'>
                { gories.map((gory, k) => <GoryView gory={gory} index={k+1} />) }
            </div>
        </div>
    );
}

interface Props {
    location: Location;
}

function GuideList({ location } : Props) {
    let isLoggedIn = useIsLoggedIn();

    let rawQuery = location.search;
    let parsedQuery = queryString.parse(rawQuery);

    let query: Query = {
        cate: parsedQuery.cate?.toString(),
        gory: parsedQuery.gory?.toString(),
        search: parsedQuery.search?.toString()
    };
    
    let [catesLoading, allCates] = usePromise(getCates);
    
    let cates = React.useMemo(() => {
        return allCates?.filter((cate) => (
            (query.cate === undefined || query.cate === cate.index.toString())
//         && (query.gory === undefined || !cate.gories.every((gory) => query.gory !== gory.index))
        ));
    }, [allCates, query]);

    if (catesLoading) return <Loading/>;
    else return (
        <ListQueryContext.Provider value={query}>
            <Header/>
            <div className='guideBackground' />
            <GuideSidebar on='list'>
                { isLoggedIn && (
                    <span>
                        <Link to={'/guide/write' + rawQuery}>
                            <button className='roundButton material-icons'> 
                                create
                            </button>
                        </Link>
                    </span>
                )}
            </GuideSidebar>
            { cates?.map((cate) => <CateView cate={cate} />) }
            <Footer/>
        </ListQueryContext.Provider>
    );
}

export default GuideList;