import { login } from 'etc/api';
import React from 'react';
import { Link } from 'react-router-dom';

interface SignInProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function validateEmail(email: string) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function validatePassword(password: string) {
    const regex1 = /^[ -~]{8,32}$/;
    return regex1.test(password);
}

function SignIn({ visible, setVisible } : SignInProps) {
    let [email, setEmail] = React.useState('');
    let [password, setPassword] = React.useState('');
    let [message, setMessage] = React.useState<string>();

    if (!visible) return <></>;
    else return (
        <>
            <div className='signinShadow' onClick={() => setVisible(false)} />
            <div className='signinContainer'>
                <div className='signinHeader'> 로그인 </div>
                <form>
                    <input className='signinForm' autoComplete='email' placeholder='아이디 (이메일)' onChange={(e) => setEmail(e.target.value)} value={email} />
                    <input className='signinForm' autoComplete='current-password' placeholder='비밀번호 (8글자 이상)' type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                    { message && <p> { message } </p> }
                    <button type='submit' className='signin' onClick={async (e) => {
                        e.preventDefault();
                        if (!validateEmail(email)) {
                            setMessage('이메일을 형식에 맞게 입력해주세요.');
                            return;
                        }
                        if (!validatePassword(password)) {
                            setMessage('비밀번호는 8글자 이상으로 적어 주세요.');
                            return;
                        }
                        login({
                            email, password,
                        }).then(({ success, message }) => {
                            if (success) setVisible(false);
                            else setMessage(message);
                        });
                    }}> 로그인 </button>
                </form>
                <Link to='/signup'> <p> 처음 오셨나요? </p> </Link>
                <p> 아이디, 비밀번호를 까먹으셨나요? </p>
            </div>
        </>
    );
}

export default SignIn;