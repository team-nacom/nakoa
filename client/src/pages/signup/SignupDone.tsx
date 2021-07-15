import Footer from 'components/Footer';
import Header from 'components/Header';
import React from 'react';
import { Redirect } from 'react-router-dom';

interface Props {
    location: any;
}

function SignUpDone({ location }: Props) {
    let [redirectToMain, setRedirectToMain] = React.useState(false);
    let nickname = location.state.nickname;

    React.useEffect(() => {
        if (!nickname) setRedirectToMain(true);
        setTimeout(() => {
            setRedirectToMain(true);
        }, 3000);
    }, [nickname, setRedirectToMain]);

    if (redirectToMain) return <Redirect push to='/' />;
    return (
        <>
            <Header />
            { `${nickname}님, 가입이 완료되었습니다. 잠시 후 메인 화면으로 이동합니다.` }
            <Footer />
        </>
    );
}

export default SignUpDone;