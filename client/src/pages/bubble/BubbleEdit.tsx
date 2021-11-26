import Footer from 'components/Footer';
import Header from 'components/Header';

import { BubblePost, getBubble, postBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import usePromise from 'etc/usePromise';
import { Redirect, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import DemoBubbleEditor from 'components/DemoBubbleEditor';

interface Params {
    id: string;
};

function BubbleEdit() {
    let user = useSelector((state: RootReducer) => state.user);
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let params = useParams<Params>();
    let id = React.useMemo(() => params.id, [params]);
    let [bubbleLoading, bubblePost] = usePromise(() => getBubble(id), [id]);

    let upload = (bubble: BubblePost, setMessage: (message: string) => void) => {
        //to be changed into bubble edit.
        postBubble(bubble).then(({success, index}) => {
            if (success) {
                setMessage('성공적으로 수정했습니다!');
                setRedirectTo(`/bubble/${index}`);
            }
            else setMessage('수정에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <div id='content'>
                <DemoBubbleEditor upload={upload} behavior='edit'/>
            </div>
            <Footer/>
        </>
    )
}


export default BubbleEdit;