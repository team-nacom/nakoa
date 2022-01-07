import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getBubble, removeBubble } from 'etc/api/bubble';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import GuideSidebar from 'components/GuideSidebar';
import { priorityTags } from 'etc/api/guide';
import Button from 'components/Button';

import { RenderedRootCell } from 'components/nabubble/cells/Parent';
import { dispatchNaBubbleState as dispatch } from 'components/nabubble';

interface Params {
    index: string;
};

function BubblePage() {
    let params = useParams<Params>();
    let index = React.useMemo(() => params.index, [params]);
    
    let [redirectToList, setRedirectToList] = React.useState(false);
    let [bubbleLoading, bubblePost] = usePromise(() => getBubble(index), [index]);

    let isEditable = true;

    if (redirectToList) return <Redirect to='/bubble' />;
    if (bubbleLoading) return <Loading/>;
    return (
        <>
            <Header />

            <GuideSidebar on='post'>
                { isEditable && 
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm('정말 삭제하시겠습니까?') && await removeBubble(index)) {
                            setRedirectToList(true);
                        }
                    }}>
                        delete
                    </Button> 
                }

                { isEditable && 
                    <span>
                        <Link to={`/bubble/${index}/edit`}>
                            <button className='material-icons'>
                                edit
                            </button> 
                        </Link>
                    </span>
                }

            </GuideSidebar>

            <div id='content'>
                { bubblePost ? (
                    <>
                        <h1 className='title' style={{lineHeight: '100px'}}> { bubblePost.name } </h1>
                        <RenderedRootCell />
                    </>
                ) : (
                    <p> 존재하지 않는 버블입니다. </p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default BubblePage;