import Footer from 'components/Footer';
import Header from 'components/Header';
import { logout } from 'etc/api/user';
import React from 'react';
import { Redirect } from 'react-router-dom';

function Logout() {
    let [logoutDone, setLogoutDone] = React.useState(false);

    React.useEffect(() => {
        logout().then((success) => {
            setLogoutDone(true);
        });
    }, []);

    if (logoutDone) return <Redirect to='/' />;
    else return (
        <>
            <Header/>
            <Footer/>
        </>
    )
}

export default Logout;