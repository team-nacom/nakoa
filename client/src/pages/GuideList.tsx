import Footer from 'components/Footer';
import Header from 'components/Header';
import { getGuides, isAdmin } from 'etc/api';
import usePromise from 'etc/usePromise';
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';

function GuideList() {
    let [guidesLoading, guides] = usePromise(getGuides);

    let categories = React.useMemo(() => {
        if (!guides) return;
        return [...new Set(guides.map(x => x.category))]
    }, [guides]);

    if (guidesLoading) return <Loading/>;
    else return (
        <>
            <Header/>
            <div className='guideBackground' />
            { isAdmin() && <Link to='/guide/add'><button className='button'> 글 쓰기 </button></Link> }
            { categories?.map((category) => {
                let nowGuides = guides.filter((guide) => guide.category === category);

                return (
                    <div key={category} className='guideList'>
                        <h1> { category || '분류되지 않음' } </h1>
                        <table>
                            <tbody>
                                { nowGuides.map((guide, k) => (
                                    <Link to={`/guide/${guide.index}`}>
                                        <tr>
                                            <td style={{width: '30px'}}> { k+1 } </td>
                                            <td style={{width: 'calc(100% - 30px)'}}>  {guide.name} </td>
                                        </tr>
                                    </Link> 
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            })}
            <Footer/>
        </>
    );
}

export default GuideList;