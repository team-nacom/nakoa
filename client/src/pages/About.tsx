import React from 'react';
import Markdown from '#/components/markdown-lab/Markdown';
import { ApplyLayout } from '#/layout/Apply';


function About() {
    let [message, setMessage] = React.useState('');

    fetch(process.env.PUBLIC_URL + '/aboutus.md')
        .then(response => response.text())
        .then(text => setMessage(text));

    return ApplyLayout({
        title: '존재하지 않는 페이지입니다.',
        content: (
            <div className='aboutDisplayWrapper'>
                <Markdown>
                    { message }
                </Markdown>
            </div>
        )
    });
}

export default About;
// export default ApplyLayout({Content: About});