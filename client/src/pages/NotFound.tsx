import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

import { EditorBubble, RenderedBubble, useNaBubbleState } from 'components/nabubble'

function NotFound() {
    let [message, setMessage] = React.useState('');

    let [ bubble ] = useNaBubbleState('bubble');

    fetch(process.env.PUBLIC_URL + '/404.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <>
            <Header/>

            <MarkdownRenderer isManual={true}>
                { message }
            </MarkdownRenderer>

            {/* for testing: */}
            {/* <div>
                <div style = { { display: 'inline-block', width: '48%' } }>
                    <EditorBubble bubbleId = { bubble.rootId } refs = { React.useRef({}) } />
                </div>
                <div style = { { display: 'inline-block', width: '48%' } }>
                    <RenderedBubble bubbleId = { bubble.rootId } />
                </div>
            </div> */}
        
            <Footer/>
        </>
    );
}

export default NotFound;