import Footer from 'components/Footer';
import Header from 'components/Header';
import { verifyEmail } from 'etc/api/user';
import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, useParams } from 'react-router-dom';


interface Params {
    email: string;
    code: string;
};

function SignUpVerify() {
    let { email, code } = useParams<Params>();
    let [verified, setVerified] = React.useState<boolean>();
    let intl = useIntl();

    React.useEffect(() => {
        verifyEmail(email, code).then((success) => {
            setVerified(success);
        })
    }, [email, code, setVerified]);
    
    if (verified !== undefined) return <Redirect to={{
        pathname: '/signup/done',
        state: { verified }
    }}/>;
    return (
        <>
            <Header />
            <div id='content'>
               { intl.formatMessage({ id: 'signup.verifyingemail' }) }
            </div>
            <Footer />
        </>
    );
}

export default SignUpVerify;