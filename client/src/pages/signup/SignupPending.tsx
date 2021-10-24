import Footer from 'components/Footer';
import Header from 'components/Header';
import { useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';

interface Props {
    location: any;
}

function SignUpPending({ location }: Props) {
    let nickname = location.state.nickname;
    let email = location.state.email;
    let intl = useIntl();

    if (!nickname || !email) return <Redirect push to='/' />;
    return (
        <>
            <Header />
            <div id='content'>
                { intl.formatMessage({ id: 'signup.pleaseverifyemail' }, { nickname, email }) }
            </div>
            <Footer />
        </>
    );
}

export default SignUpPending;