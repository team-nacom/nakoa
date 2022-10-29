import React from 'react';
import Header from '#/components/Header';
import Footer from '#/components/Footer';
import Markdown from '#/components/markdown-lab/Markdown';


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
                <Markdown>
                    { message }
                </Markdown>
            </div>
            <Footer/>
        </>
    );
}

export default NotFound;