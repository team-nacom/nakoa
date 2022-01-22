import Footer from 'components/Footer';
import Header from 'components/Header';
import { getBubble, hideBubble, unhideBubble, BubbleType } from 'etc/api/bubble';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
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
    let history = useHistory();
    let index = React.useMemo(() => params.index, [params]);

    let [bubblePost, setbubblePost] = React.useState<BubbleType>();
    let [bubbleLoading, _] = usePromise(() => {
        return getBubble(index).then(bubble => setbubblePost(bubble));
    }, [index]);

    React.useEffect(() => {
        let content = bubblePost?.content;
        if (!content) return;
        while(typeof content === 'string'){
            content = JSON.parse(content);
        }

        dispatch({
            type: 'init',
            bubble: content || {
                type: 'parent',
                children : [ {type: 'text', value: ''} ]
            }
        })
    }, [bubblePost]);

    let [toggleBubble, icon, confirmMesg] = bubblePost?.hidden ? 
        [unhideBubble, 'visibility', '정말 이 글을 공개하시겠습니까?'] :
        [hideBubble, 'visibility_off', '정말 이 글을 숨기시겠습니까?'];

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
                    <Button className='material-icons' onClick={async (e) => {
                        e.preventDefault();
                        history.push('/write', {copySourceBubble: bubblePost});
                    }}> content_copy </Button>
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