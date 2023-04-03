import { useEffect, useState, useMemo, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { removeLocalArticle } from '#/api/article-local-idb';

import Loading from '../Loading';
import usePromise from '#/misc/usePromise';

function Delete() {
    const { localIndex } = useParams<{ localIndex: string }>();

    const [loading] = usePromise(() => removeLocalArticle(localIndex), [localIndex]);

    if(loading) return <Loading />;
    return <Redirect to={'/article/list'} />;
}

export default Delete;