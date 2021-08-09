import { login } from 'etc/api/user';
import encryptPassword from 'etc/encryptPassword';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from './Button';

interface SignInProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function validateEmail(email: string) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
    let intl = useIntl();

    if (!visible) return <></>;
    else return (
        <>
            <div className='signinShadow' onClick={() => setVisible(false)} />
            <div className='signinContainer'>
                <span className='material-icons backButton link' onClick={() => setVisible(false)}> arrow_back </span>
                <div className='signinHeader'> { intl.formatMessage({ id: 'signin.title' }) } </div>
                <form>
                    <input className='signinForm' autoComplete='email' placeholder={ intl.formatMessage({ id: 'signin.email' }) }  onChange={(e) => setEmail(e.target.value)} value={email} />
                    <input className='signinForm' autoComplete='current-password' placeholder= { intl.formatMessage({ id: 'signin.password' }) } type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                    { message && <p className='helpText'> { message } </p> }
                    <div style={{marginBottom: '42px'}}/>
                    <Link to='/signup'> <p className='helpText'> { intl.formatMessage({ id: 'signin.newhere' }) } </p> </Link>
                    <div className='buttonContainer'>
                        <Button type='submit' className='signin' onClick={async (e) => {
                            e.preventDefault();
                            if (!validateEmail(email)) {
                                setMessage('이메일을 형식에 맞게 입력해주세요.');
                                return;
                            }
                            if (!validatePassword(password)) {
                                setMessage('비밀번호는 8글자 이상으로 적어 주세요.');
                                return;
                            }
                            const encryptedPassword = await encryptPassword(email, password);
                            login({
                                email, password: encryptedPassword,
                            }).then(({ success, message }) => {
                                if (success) setVisible(false);
                                else setMessage(message);
                            });
                        }}>  { intl.formatMessage({ id: 'signin.signin' }) }  </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignIn;