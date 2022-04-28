import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getFlatsByAuthor, FlatItem } from "etc/api/flat";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import React from 'react';
import { Link, useParams } from "react-router-dom";
import AuthorInput from 'components/editor/AuthorInput';
import Button from 'components/Button';
import { localStorageKeys } from "etc/consts";

interface Params {
    author?: string;
};

function FlatList() {
    let { author: paramAuthor } = useParams<Params>();
    let storedAuthor = localStorage.getItem(localStorageKeys.authorSearchQuery);
    let [author, setAuthor] = React.useState<string>(paramAuthor ?? (storedAuthor ?? ''));
    React.useEffect(() => {
        localStorage.setItem(localStorageKeys.authorSearchQuery, author);
    }, [author]);

    let [flat, setFlats] = React.useState<FlatItem[]>([]);
    let [flatLoading, _] = usePromise(() => 
        getFlatsByAuthor(author).then(fetchedFlat => setFlats(fetchedFlat)));

    return (
        <>
            <Header/>
            <div className='guideBackground' />
            <BubbleSidebar on='list'>
                <span>
                    <Link to={'/write'}>
                        <button className='roundButton material-icons'> 
                            create
                        </button>
                    </Link>
                </span>
            </BubbleSidebar>
            <div id='content'>
                <PageTitle>
                    글 검색
                </PageTitle>
                
                <div className='cellListWrapper'>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setFlats(await getFlatsByAuthor(author));
                    }} id='authorForm'>
                        <div className='flexbox'>
                            <AuthorInput author={author} setAuthor={setAuthor} />
                            <input type="submit" style={{display: 'none'}} />
                        </div>

                        <Button className='submit link' onClick={async (e) => {
                            setFlats(await getFlatsByAuthor(author));
                        }}>
                            검색
                        </Button>
                    </form>
                    
                    { !flatLoading && flat && flat.length > 0 && 
                        <div className='searchedFlatItemList'>
                            {flat?.map((flat) => <div key={flat.title} className='searchedFlatItem'>
                                <Link to={`/view/${flat.index}`}>
                                    <div className='searchedFlatItemInfo'>
                                        <div className='title'> { flat.title ? flat.title : "untitled" } </div>
                                        <div className='author'> by { flat.author ?? "anonymous" } </div>
                                        {/* <div className='content'> { flat.content.substring(0, 100) } </div> */}
                                    </div>
                                </Link>
                            </div>)}
                        </div>
                    }
                </div>
            </div>

            <Footer/>
        </>
    );
}

export default FlatList;