import React from 'react';
import Header from '#/components/Header';
import Footer from '#/components/Footer';
import Markdown from '#/components/markdown-lab/Markdown';



function About() {
    let [message, setMessage] = React.useState('');

    fetch(process.env.PUBLIC_URL + '/aboutus.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <>
            <Header/>
            <div id='content'>
                <div className='aboutDisplayWrapper'>
                    <Markdown>
                        { message }
                    </Markdown>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default About;