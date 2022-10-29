import React from 'react';
import Header from '#/components/Header';
import Footer from '#/components/Footer';
import { useIntl } from 'react-intl';


function Main() {
    let intl = useIntl();
    return (
        <>
            <Header/>

            <div id='content'>
                { intl.formatMessage({ id: 'main.greeting' })}
            </div>
            
            <Footer/>
        </>
    );
}

export default Main;