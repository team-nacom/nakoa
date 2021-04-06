import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuides, isAdmin } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';

function GuideList() {
    let [guidesLoading, guides] = usePromise(getGuides);

    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' />
            { isAdmin() && <Link to='/admin/guide/add'><button className='button'> 가이드 추가하기 </button></Link> }
            <table>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}> # </th>
                        <th style={{width: '95%'}}> 가이드 이름 </th>
                    </tr>
                </thead>
                <tbody>
                    { guides.map((guide) => (
                        <tr>
                            <td> { guide.index } </td>
                            <td> <Link to={`/guide/${guide.index}`}> {guide.name} </Link> </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

export default GuideList;