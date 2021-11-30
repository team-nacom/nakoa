import GuideView from 'components/GuideView';
import Footer from 'components/Footer';
import Header from 'components/Header';
import { getBubble } from 'etc/api/bubble';
import { useIsAdmin } from 'etc/api/user';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import GuideSidebar from 'components/GuideSidebar';
import { priorityTags } from 'etc/api/guide';
import Button from 'components/Button';

import { RenderedRootBubble } from 'components/nabubble/types/Parent';
import { dispatchNaBubbleState as dispatch } from 'components/nabubble';

interface Params {
    id: string;
};

function BubblePage() {
    const params = useParams<Params>();
    const id = React.useMemo(() => params.id, [params]);
    const user = useSelector((state: RootReducer) => state.user);
    const isAdmin = useIsAdmin();

    const isEditable = true;
    
    const [bubbleLoading, bubblePost] = usePromise(() => getBubble(id), [id]);
    
    if (bubbleLoading) return <Loading/>;
    return (
        <>
            <Header />
            <div className='bubbleSidebar'>

                { isEditable && 
                    <span>
                        <Link to={`/bubble/${id}/edit`}>
                            <button className='material-icons'>
                                edit
                            </button> 
                        </Link>
                    </span>
                }
            </div>
            <div id='content'>
                { bubblePost ? (
                    <RenderedRootBubble />
                ) : (
                    <p> 존재하지 않는 버블입니다. </p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default BubblePage;