import Footer from 'components/Footer';
import Header from 'components/Header';
import { Redirect } from 'react-router-dom';

interface Props {
    location: any;
}

function SignUpPending({ location }: Props) {
    let nickname = location.state.nickname;
    let email = location.state.email;

    if (!nickname || !email) return <Redirect push to='/' />;
    return (
        <>
            <Header />
            { `${nickname}님, 나무컴퍼스에 가입해주셔서 감사합니다. 작성해주신 이메일 ${email}을 확인하기 위해 메일을 하나 보내드렸습니다. 메일에 있는 링크를 클릭해주시면 가입이 완료됩니다.` }
            <Footer />
        </>
    );
}

export default SignUpPending;