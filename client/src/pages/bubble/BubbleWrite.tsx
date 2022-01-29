import Footer from 'components/Footer';
import Header from 'components/Header';

import { BubblePost, postBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import { Redirect, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import DemoBubbleEditor from 'components/DemoBubbleEditor';

import { dispatchNaBubbleState as dispatch } from 'components/nabubble'
import { Bubble } from 'components/nabubble/bubble';

interface State {
    copySourceBubble?: Partial<BubblePost>
}

function BubbleWrite() {
    let [redirectTo, setRedirectTo] = React.useState<string>();

    let location = useLocation<State>();
    let sourceBubble = location.state?.copySourceBubble;
    let sourceContent: Bubble | string | undefined = sourceBubble?.content;

    for (let _=0; _<3; _++){
        if (typeof sourceContent !== 'string') break;
        sourceContent = JSON.parse(sourceContent);
    }

    let storedAuthor = localStorage.getItem('author');
    if (!sourceBubble && storedAuthor) {
        sourceBubble = {author: storedAuthor};
    }

    // initialize
    useEffect(()=>{
        dispatch({
            type: 'init',
            bubble: (sourceContent as Bubble) || {
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
                <DemoBubbleEditor initialBubble={sourceBubble} upload={upload}/>
            </div>
            <Footer/>
        </>
    )
}


export default BubbleWrite;