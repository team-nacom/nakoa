import Footer from 'components/Footer';
import Header from 'components/Header';

import usePromise from 'etc/usePromise';
import { BubblePost, getBubble, postBubble } from 'etc/api/bubble';
import React, {useCallback, useEffect, useRef} from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store';
import queryString from 'query-string';
import DemoBubbleEditor from 'components/DemoBubbleEditor';
import Loading from 'pages/Loading';
import { RenderedRootBubble } from 'components/nabubble';
import { useTextEditorState, useNaBubbleState, dispatchNaBubbleState as dispatch } from '../../components/editor/globals';
import { Bubble as BubbleData, FlatBubble, inflate } from 'components/nabubble/data';


interface Params {
    id: string;
};


function Bubble() {
    let { id: index } = useParams<Params>();
    let [bubbleLoading, bubbleObj] = usePromise(() => getBubble(index));

    let flatbubble : FlatBubble = (bubbleObj ? JSON.parse(bubbleObj.content) : {}) as FlatBubble ;
    let bubble = inflate(flatbubble);

    // useEffect(()=>{
    //     dispatch({
    //         type: 'init',
    //         bubble: bubble
    //     })
    // },[]);

    if (bubbleLoading) return <Loading/>;

    dispatch({
        type: 'init',
        bubble: bubble
    });

    return (
        <>
            <Header/>

            <div className='guide'>
                <div className='guideBackground' />
                <h1 className='title'> { bubbleObj!.name } </h1>
                {(bubbleObj!.tags != null && bubbleObj!.tags.length > 0) && 
                    <h3 className='tags'> { '#' + bubbleObj!.tags.join(' #')} </h3>
                }
                <div className={'guideContent'}>
                    <RenderedRootBubble />
                    <hr/>
                    <div>{(bubbleObj!.tags != null && bubbleObj!.tags.length > 0) &&  '#' + bubbleObj!.tags.join(' #')}</div>
                </div>
            </div>
            <Footer/>
        </>
    )
}


export default Bubble;