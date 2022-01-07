import Footer from 'components/Footer';
import Header from 'components/Header';

import { BubblePost, getBubble, editBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import usePromise from 'etc/usePromise';
import { Redirect, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import DemoBubbleEditor from 'components/DemoBubbleEditor';
import Loading from '../Loading';

interface Params {
    index: string;
};

function BubbleEdit() {
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let params = useParams<Params>();
    let index = React.useMemo(() => params.index, [params]);
    let [bubbleLoading, bubblePost] = usePromise(() => getBubble(index), [index]);

    let upload = (bubble: BubblePost, setMessage: (message: string) => void) => {
        //to be changed into bubble edit.
        editBubble(index, bubble).then((success) => {
            if (success) {
                setMessage('성공적으로 수정했습니다!');
                setRedirectTo(`/bubble/${index}`);
            }
            else setMessage('수정에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />;
    if (bubbleLoading) return <Loading/>;
    return (
        <>
            <Header/>
            <div id='content'>
                <DemoBubbleEditor initialBubble={bubblePost} upload={upload} behavior='edit'/>
            </div>
            <Footer/>
        </>
    )
}


export default BubbleEdit;