import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MarkdownRenderer from 'components/markdown/MarkdownRenderer';

function NotFound() {
    let [message, setMessage] = React.useState('');

    React.useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/404.md')
            .then(response => response.text())
            .then(text => setMessage(text));
    }, [])

    return (
        <>
            <Header/>
            <div id='content'>
                <MarkdownRenderer isManual={true}>
                    { message }
                </MarkdownRenderer>
            </div>
            {/* for testing: */}
            <Footer/>
        </>
    );
}

export default NotFound;