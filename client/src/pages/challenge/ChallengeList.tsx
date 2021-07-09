import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Tabs from 'components/Tabs';
import { Link } from 'react-router-dom';
import usePromise from 'etc/usePromise';
import { getChallList } from 'etc/api/chall';
import { useIsAdmin } from 'etc/api/user';
import Loading from '../Loading';

function ChallengeList() {
    let [challLoading, challs] = usePromise(getChallList);
    let isAdmin = useIsAdmin();

    if (challLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <Tabs data={[
                {
                    name: "문제 목록",
                    link: '/challenge',
                    active: true,
                }
            ]} />
            { isAdmin && <Link to='/challenge/write'><button className='button'> 챌린지 추가하기 </button></Link> }
            <table>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}> # </th>
                        <th style={{width: '80%'}}> 문제 이름 </th>
                        <th style={{width: '15%'}}> 푼 사람 수 </th>
                    </tr>
                </thead>
                <tbody>
                    { challs.map((chall) => (
                        <tr>
                            <td> { chall.index } </td>
                            <td> <Link to={`/challenge/${chall.index}`}> {chall.name} </Link> </td>
                            <td> - </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

export default ChallengeList;