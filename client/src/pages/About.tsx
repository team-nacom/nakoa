import React from 'react';
import Markdown from '#/components/markdown-lab/Markdown';



function About() {
    let [message, setMessage] = React.useState('');

    fetch(process.env.PUBLIC_URL + '/aboutus.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return (
        <div className='aboutDisplayWrapper'>
            <Markdown>
                { message }
            </Markdown>
        </div>
    );
}

export default About;