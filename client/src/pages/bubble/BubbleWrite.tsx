import Footer from 'components/Footer';
import Header from 'components/Header';

import { BubblePost, postBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import DemoBubbleEditor from 'components/DemoBubbleEditor';

import { dispatchNaBubbleState as dispatch } from 'components/nabubble'

function BubbleWrite() {
    let [redirectTo, setRedirectTo] = React.useState<string>();

    // initialize
    useEffect(()=>{
        dispatch({
            type: 'init',
            bubble: {
                type: 'parent',
                children : [ {type: 'text', value: ''} ]
            }
        })
    },[]);

    let upload = (bubble: BubblePost, setMessage: (message: string) => void) => {
        postBubble(bubble).then(({success, index}) => {
            if (success) {
                setMessage('업로드에 성공했습니다!');
                setRedirectTo(`/view/${index}`);
            }
            else setMessage('업로드에 실패했습니다...');
        })
    }

    if (redirectTo) return <Redirect to={redirectTo} />
    return (
        <>
            <Header/>
            <div id='content'>
                <DemoBubbleEditor upload={upload}/>
            </div>
            <Footer/>
        </>
    )
}


export default BubbleWrite;