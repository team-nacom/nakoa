import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { RootReducer } from 'store';


function MyPage() {
    let user = useSelector((state: RootReducer) => state.user);

    if (user.loggedIn) return <Redirect to={`/user/${user.nickname}`} />;
    else return <Redirect to='/' />;
}

export default MyPage;