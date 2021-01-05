import React from 'react';

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
                <input className='signinForm' placeholder='아이디' />
                <input className='signinForm' placeholder='비밀번호' />
                <button className='signin'> 로그인 </button>
                <p> 처음 오셨나요? </p>
                <p> 아이디, 비밀번호를 까먹으셨나요? </p>
            </div>
        </>
    );
}

export default SignIn;