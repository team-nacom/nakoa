import Footer from 'components/Footer';
import Header from 'components/Header';
import { getBubble, hideBubble, unhideBubble, BubbleType } from 'etc/api/bubble';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import Loading from '../Loading';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import BubbleSidebar from 'components/BubbleSidebar';
import Button from 'components/Button';

import { RenderedRootCell } from 'components/nabubble/cells/Parent';
import { dispatchNaBubbleState as dispatch } from 'components/nabubble';

interface Params {
    index: string;
};

function BubblePage() {
    let params = useParams<Params>();
    let index = React.useMemo(() => params.index, [params]);
    let [bubblePost, setbubblePost] = React.useState<BubbleType>();
    let [bubbleLoading, _] = usePromise(() => getBubble(index).then(bubble => setbubblePost(bubble)), [index]);
    
    let [redirectToList, setRedirectToList] = React.useState(false);

    let [toggleBubble, icon, confirmMesg] = bubblePost?.hidden ? 
        [unhideBubble, 'visibility', '정말 이 글을 공개하시겠습니까?'] :
        [hideBubble, 'visibility_off', '정말 이 글을 숨기시겠습니까?'];

    if (redirectToList) return <Redirect to='/list' />;
    if (bubbleLoading) return <Loading/>;
    return (
        <>
            <Header />
            { bubblePost && (
                <BubbleSidebar on='post'>
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        if (window.confirm(confirmMesg)) {
                            await toggleBubble(index);
                            setbubblePost(await getBubble(index));
                        }
                    }}> {icon} </Button>
                {/* <span>
                    <Link to={`/bubble/${index}/edit`}>
                        <button className='material-icons'>
                            edit
                        </button> 
                    </Link>
                </span> */}

                </BubbleSidebar>
            )}

            <div id='content'>
                { bubblePost ? (
                    <>
                        <h1 className='title' style={{lineHeight: '100px'}}> { bubblePost.title } </h1>
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