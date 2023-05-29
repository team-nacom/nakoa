import { Link } from "react-router-dom";

import { PAGE_SIZE } from "#/common/consts";

interface PaginationProps {
    page: number,
    count: number | undefined,
    pageToLink: string | ((page: number) => string),
}
export function Pagination(props : PaginationProps){
    const {page, count, pageToLink} = props;
    const fn: ((page: number) => string) =
        typeof pageToLink === 'string' ? (page) => (pageToLink + page) : pageToLink;
    return (<div className='pagination'>
        { page > 0 && (
            <Link to={ fn(page-1) }>
                ◀이전
            </Link>
        )}
        <span> { page }페이지 </span>
        { page < Math.ceil( (count ?? 0) / PAGE_SIZE ) - 1 &&
            <Link to={ fn(page+1) }>
                다음▶
            </Link>
        }
    </div>);
}