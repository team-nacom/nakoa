import Footer from 'components/Footer';
import Header from 'components/Header';
import React from 'react';
import { Redirect } from 'react-router-dom';

interface Props {
    location: any;
}

function SignUpDone({ location }: Props) {
    let verified = location.state.verified;

    if (verified === undefined) return <Redirect to='/' />
    else return (
        <>
            <Header />
            { verified 
                ? '이메일이 확인되었습니다! 나무컴퍼스의 회원이 되어주셔서 진심으로 감사드립니다. 이제 이메일과 비밀번호를 이용해 로그인하실 수 있습니다.' 
                : '이메일을 확인하는 데에 실패했습니다... 이 페이지가 계속 뜨면 nacommanager@gmail.com으로 문의해주세요.'
            }
            <Footer />
        </>
    );
}

export default SignUpDone;