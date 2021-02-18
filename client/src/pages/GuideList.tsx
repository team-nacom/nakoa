import GuidePost from 'components/GuidePost';
import Footer from 'components/Footer';
import Header from 'components/Header';
import Markdown from 'components/Markdown';
import { getGuides } from 'etc/api';
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
            <table>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}> # </th>
                        <th style={{width: '95%'}}> 블로그 이름 </th>
                    </tr>
                </thead>
                <tbody>
                    { guides.map((guide) => (
                        <tr>
                            <td> { guide.index } </td>
                            <td> <Link to={`/guide/${guide.index}`}> {guide.name} </Link> </td>
                            <td> - </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

export default GuideList;