import React from 'react';
import { Link } from 'react-router-dom';

interface SignInProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function SignIn({ visible, setVisible } : SignInProps) {
    if (!visible) return <></>;
    else return (
        <>
            <div className='signinShadow' onClick={() => setVisible(false)} />
            <div className='signinContainer'>
                <div className='signinHeader'> 로그인 </div>
                <input className='signinForm' placeholder='아이디 (이메일)' />
                <input className='signinForm' placeholder='비밀번호 (영문, 숫자 혼합 8자 이상)' />
                <button className='signin'> 로그인 </button>
                <Link to='/signup'> <p> 처음 오셨나요? </p> </Link>
                <p> 아이디, 비밀번호를 까먹으셨나요? </p>
            </div>
        </>
    );
}

export default SignIn;