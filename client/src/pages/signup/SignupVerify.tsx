import Footer from 'components/Footer';
import Header from 'components/Header';
import { verifyEmail } from 'etc/api/user';
import React from 'react';
import { useIntl } from 'react-intl';
import { match, Redirect } from 'react-router-dom';


interface MatchParams {
    email: string;
    code: string;
};

interface Props {
    match: match<MatchParams>;
};

function SignUpVerify({ match }: Props) {
    let email = match.params.email;
    let code = match.params.code;
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
            { intl.formatMessage({ id: 'signup.verifyingemail' }) }
            <Footer />
        </>
    );
}

export default SignUpVerify;