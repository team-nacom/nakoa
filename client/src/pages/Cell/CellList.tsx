import Footer from "components/Footer";
import BubbleSidebar from 'components/BubbleSidebar';
import Header from "components/Header";
import PageTitle from "components/PageTitle";
import { getFlatsByAuthor, FlatItem } from "etc/api/flat";
import usePromise from "etc/usePromise";
import Loading from "pages/Loading";
import React from 'react';
import { Link, useParams } from "react-router-dom";
import AuthorInput from '../../components/AuthorInput';
import Button from '../../components/Button';

interface Params {
    author?: string;
};

function CellList() {
    let { author: paramAuthor } = useParams<Params>();
    let storedAuthor = localStorage.getItem('author');
    let [author, setAuthor] = React.useState<string>(paramAuthor ?? (storedAuthor ?? ''));
    React.useEffect(() => {
        localStorage.setItem("author", author);
    }, [author]);

    let [cell, setCells] = React.useState<FlatItem[]>([]);
    let [cellLoading, _] = usePromise(() => 
        getFlatsByAuthor(author).then(cellFetch => setCells(cellFetch)));

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
                
                <div className='writeBox guide'>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setCells(await getFlatsByAuthor(author));
                    }} id='authorForm'>
                        <div className='flexbox'>
                            <AuthorInput author={author} setAuthor={setAuthor} />
                            <input type="submit" style={{display: 'none'}} />
                        </div>

                        <div className='editorBottom'>
                            <Button className='submit link' onClick={async (e) => {
                                setCells(await getFlatsByAuthor(author));
                            }}>
                                검색
                            </Button>
                        </div>
                    </form>
                </div>

                { !cellLoading && cell && cell.length > 0 && 
                    <div className='bubbleFeedList'>
                        {cell?.map((cell) => <div key={cell.title} className='bubbleFeed'>
                            <Link to={`/view/${cell.index}`}>
                                <div className='bubbleFeedContent'>
                                    <div className='title'> { cell.title ? cell.title : "untitled" } </div>
                                    <div className='author'> by { cell.author ?? "anonymous" } </div>
                                    {/* <div className='content'> { cell.content.substring(0, 100) } </div> */}
                                </div>
                            </Link>
                        </div>)}
                    </div>
                }
            </div>

            <Footer/>
        </>
    );
}

export default CellList;