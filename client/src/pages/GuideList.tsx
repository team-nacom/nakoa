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
                        <div className='guideListContainer'>
                            { nowGuides.map((guide, k) => (
                                <Link to={`/guide/${guide.index}`}>
                                    <div className='guideListItem'>
                                        <span style={{flex: '0 0 50px', fontWeight: 'bold'}}> { k+1 } </span>
                                        <span style={{flexGrow: 1}}>  {guide.name} </span>
                                    </div>
                                </Link> 
                            ))}
                        </div>
                    </div>
                )
            })}
            <Footer/>
        </>
    );
}

export default GuideList;