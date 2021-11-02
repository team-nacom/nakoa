import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

import { EditorRootBubble, RenderedRootBubble, useNaBubbleState, dispatchNaBubbleState as dispatch } from 'components/nabubble';

import BubbleEditor from 'components/editor/BubbleEditor'

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
            <BubbleEditor />
        
            <Footer/>
        </>
    );
}

export default NotFound;