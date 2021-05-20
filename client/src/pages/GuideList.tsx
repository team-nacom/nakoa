import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuides, GuideType, useIsAdmin } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';

interface GuideSectionProps {
    index: number;
    title: string;
    guides: GuideType[];
};

let priorityString = ['Draft', 'Optional', 'Readable', 'Recommendable', 'Essential', 'Draft'];

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
                            <span className='priority'> { priorityString[guide.priority] } </span>
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
    sections: string[];
}

function GuideCategory({ title, guides, sections } : GuideCategoryProps) {
    return (
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
    let [guidesLoading, guides] = usePromise(getGuides);
    let isAdmin = useIsAdmin();

    let categories = React.useMemo(() => {
        if (!guides) return;
        return [...new Set(guides.map(x => x.category))];
    }, [guides]);

    let sections = React.useMemo(() => {
        if (!guides) return;

        return [...new Set(guides.map(x => x.section ))];
    }, [guides]);

    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' />
            <div className='flexbox'>
                { isAdmin && <span><Link to='/guide/add'><button className='button'> 글 쓰기 </button></Link></span> }
            </div>
            { categories?.map((category) => {
                if (!sections) return;
                let nowGuides = guides.filter((guide) => guide.category === category);
                let nowSections = sections.filter((section) => nowGuides.filter((guide) => section === guide.section).length > 0);
                return <GuideCategory title={category} guides={nowGuides} sections={nowSections} />
            })}
            <Footer/>
        </>
    );
}

export default GuideList;