import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuideCategories, getGuides, getGuideSections, GuideType } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import { priorityTags } from 'etc/consts';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

interface GuideSectionProps {
    index: number;
    title: string;
    guides: GuideType[];
};

function GuideSection({ index, title, guides } : GuideSectionProps) {
    let [isCollapsed, setIsCollapsed] = React.useState(true);

    return (
        <>
            <div className='guideListItemContainer link'>
                <div className='guideListSection' onClick={(e) => { e.preventDefault(); setIsCollapsed(!isCollapsed); }}>
                    <span className='index'> { index } </span>
                    <span className='title'>  { title } </span>
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

interface GuideCategoryProps {
    title: string;
    guides: GuideType[];
}

function GuideCategory({ title, guides } : GuideCategoryProps) {
    let [sectionsLoading, sections] = usePromise(() => getGuideSections(title));

    if (sectionsLoading) return <></>;
    else return (
        <div key={title} className='guideList'>
            <h1> { title || '분류되지 않음' } </h1>
            <div className='guideListContainer'>
                { 
                    sections.map((section, k) => 
                        <GuideSection title={section} index={k+1} guides={guides.filter((guide) => guide.section === section)} />
                    )
                }
            </div>
        </div>
    );
}

function GuideList() {
    let isAdmin = useIsAdmin();

    let [guidesLoading, guides] = usePromise(getGuides);
    let [categoryLoading, categories] = usePromise(getGuideCategories);

    if (guidesLoading || categoryLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' />
            <div className='flexbox'>
                { isAdmin && <span><Link to='/guide/write'><button className='button'> 글 쓰기 </button></Link></span> }
            </div>
            { categories?.map((category) => 
                <GuideCategory title={category} guides={guides.filter((guide) => guide.category === category)} />
            )}
            <Footer/>
        </>
    );
}

export default GuideList;