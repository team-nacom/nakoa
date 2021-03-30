import Footer from 'components/Footer';
import Header from 'components/Header';
import PageTitle from 'components/PageTitle';
import { register } from 'etc/api';
import React from 'react';
import { Redirect } from 'react-router-dom';

function SignUp() {
    let [redirectToDone, setRedirectToDone] = React.useState(false);

    let [message, setMessage] = React.useState('');
    
    let [email, setEmail] = React.useState('');
    let [emailMessage, setEmailMessage] = React.useState('');
    let validateEmail = async () => {
        if (email.length === 0) {
            setEmailMessage('이메일을 적어 주세요.');
            return false;
        }

        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            setEmailMessage('이메일의 형식이 올바르지 않습니다.');
            return false;
        }
        setEmailMessage('');
        return true;
    }

    let [password, setPassword] = React.useState('');
    let [passwordMessage, setPasswordMessage] = React.useState('');
    let validatePassword = () => {
        if (password.length === 0) {
            setPasswordMessage('비밀번호를 적어 주세요.');
            return false;
        }

        const regex1 = /^[ -~]{8,32}$/;

        if (!regex1.test(password)) {
            setPasswordMessage('비밀번호는 8글자 이상으로 적어 주세요.');
            return false;
        }
        setPasswordMessage('');
        return true;
    }

    let [passwordConfirm, setPasswordConfirm] = React.useState('');
    let [passwordConfirmMessage, setPasswordConfirmMessage] = React.useState('');
    let validatePasswordConfirm = () => {
        let result = password === passwordConfirm;

        if (!result) {
            setPasswordConfirmMessage('비밀번호와 비밀번호 확인 란이 다릅니다.');
            return false;
        }
        setPasswordConfirmMessage('');
        return true;
    }

    let [nickname, setNickname] = React.useState('');
    let [nicknameMessage, setNicknameMessage] = React.useState('');
    let validateNickname = () => {
        if (nickname.length === 0) {
            setNicknameMessage('이름을 적어 주세요.');
            return false;
        }

        const regex = /^[ -~가-힣]{2,100}$/;
        if (!regex.test(nickname)) {
            setNicknameMessage('이름은 영문, 숫자, 특수문자, 한글만 사용해서 2글자 이상 100글자 이하로 해 주세요.');
            return false;
        }
        setNicknameMessage('');
        return true;
    }

    let entries = [
        {
            name: '이메일 (아이디)',
            body: (
                <>
                    <input className='signupForm' autoComplete='email' placeholder='예시: example@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} />
                </>
            ),
            message: emailMessage,
            validate: validateEmail,
        }, {
            name: '비밀번호',
            body: (
                <>
                    <input type='password' className='signupForm' autoComplete='new-password' placeholder='8글자 이상 영문, 숫자 혼합' onChange={(e) => setPassword(e.target.value) } value={password}/>
                </>
            ),
            message: passwordMessage,
            validate: validatePassword,
        }, {
            name: '비밀번호 확인',
            body: (
                <>
                    <input type='password' className='signupForm' autoComplete='new-password'  onChange={(e) => { setPasswordConfirm(e.target.value); }} value={passwordConfirm}/>
                </>
            ),
            message: passwordConfirmMessage,
            validate: validatePasswordConfirm,
        }, {
            name: '닉네임',
            body: (
                <>
                    <input className='signupForm' autoComplete='name' placeholder='2글자 이상 10글자 이하 한글, 영문, 숫자' onChange={(e) => setNickname(e.target.value)} value={nickname}/>
                </>
            ),
            message: nicknameMessage,
            validate: validateNickname,
        }
    ]

    let validateAll = async () => {
        let result = true;

        for (let { validate } of entries) {
            if (!await validate()) result = false;
        }
        
        return result;
    }

    
    if (redirectToDone) return <Redirect to={{
        pathname: '/signup/done',
        state: { nickname, }
    }} />;
    return (
        <>
            <Header/>
            <PageTitle> 가입 </PageTitle>
            <p> 나무컴퍼스에 관심을 가지고 가입해주셔서 감사합니다. </p>
            <p> 가입하시려면, 아래 항목을 채워주세요. 입력해주신 개인정보는 로그인 외 다른 용도로 이용되지 않습니다.</p>

            <form>
                <div className='signupBox'>
                    { entries.map((({ name, body, message, validate }) => (
                        <>
                            <div className='signupLabel'> { name } </div>
                            { body }
                            { message && <p> { message } </p> }
                        </>
                    )))}
                </div>

                <button type='submit' className='button' onClick={async (e) => {
                    e.preventDefault();
                    if (!await validateAll()) return false;
                    let { success, message } = await register({ email, password, nickname });
                    console.log(success, message);
                    if (success) {
                        setRedirectToDone(true);
                    } else {
                        setMessage('가입에 실패했습니다: ' + message);
                    }
                }}> 가입하기 </button>
                { message && <p style={{marginBottom: '8px'}}> { message } </p> }
                { entries.map(({ name, message } ) => {
                    if (message) return <p style={{marginBottom: '8px'}}> { `${name}: ${message}` } </p>   
                    else return undefined;
                }) }
            </form>
            <Footer/>
        </>
    )
}

export default SignUp;