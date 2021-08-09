import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuide, getGuideCategories, GuideFilterType, defaultGuideFilter, PriorityTags, removeGuide } from 'etc/api/guide';
import { useIsAdmin } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, match, Redirect } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import GuideSidebar from 'components/GuideSidebar';
import { priorityTags } from 'etc/api/guide';
import Button from 'components/Button';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function Guide({ match } : Props) {
    let id = Number.parseInt(match.params.id);
    let user = useSelector((state: RootReducer) => state.user);
    let isAdmin = useIsAdmin();
    
    let [guideLoading, guide] = usePromise(() => getGuide(id), [id]);

    let [redirectToList, setRedirectToList] = React.useState(false);
    let [selectingPriority, setSelectingPriority] = React.useState(false);
    let [filter, setFilter] = React.useState<GuideFilterType>(defaultGuideFilter);

    let isEditable = React.useMemo(() => {
        if (!guide) return false;
        if (isAdmin) return true;
        return !guide.authors.every((author) => author !== user.nickname);
    }, [user, isAdmin, guide]);
    
    if (redirectToList) return <Redirect to='/guide' />
    if (guideLoading) return <Loading/>;
    return (
        <>
            <Header />

            <GuideSidebar on='post'>
                <span>
                    <button 
                        className='material-icons' 
                        onClick={() => setSelectingPriority(!selectingPriority)}
                        style={selectingPriority ? {background: '#cccccc'} : {}}
                    >
                        filter_list
                    </button>
                    { selectingPriority && (
                        <div className='prioritySelectorContainer'>
                            { priorityTags.slice(0).reverse().map((tag, k) => (
                                <div 
                                    className='prioritySelector link'
                                    onClick={() => setFilter({
                                        ...filter, 
                                        [tag]: !filter[tag as PriorityTags]
                                    })}
                                > 
                                    { filter[tag as PriorityTags] && <span className='material-icons' style={{fontSize: '15px', transform: 'translateY(2px)', margin: '0px 4px'}}> check </span> }
                                    { tag } 
                                </div>
                            ))}
                        </div>
                    ) }
                </span>

                { isEditable && 
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm('정말 삭제하시겠습니까?') && await removeGuide(id)) {
                            setRedirectToList(true);
                        }
                    }}>
                        delete
                    </Button> 
                }

                { isEditable && 
                    <span>
                        <Link to={`/guide/${id}/edit`}>
                            <button className='material-icons'>
                                edit
                            </button> 
                        </Link>
                    </span>
                }

            </GuideSidebar>

            { guide ? (
                <GuideView guide={guide} filter={filter} />
            ) : (
                <p> 존재하지 않는 가이드입니다. </p>
            )}
            <Footer />
        </>
    );
}
export default Guide;