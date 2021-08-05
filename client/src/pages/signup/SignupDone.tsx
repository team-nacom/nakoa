import Footer from 'components/Footer';
import Header from 'components/Header';
import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

interface Props {
    location: any;
}

function SignUpDone({ location }: Props) {
    let verified = location.state.verified;
    let intl = useIntl();

    if (verified === undefined) return <Redirect to='/' />
    else return (
        <>
            <Header />
            { intl.formatMessage({ id: verified ? 'signup.success' : 'signup.failure' }) }
            <Footer />
        </>
    );
}

export default SignUpDone;