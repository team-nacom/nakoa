import { openDB, DBSchema } from 'idb';


import type { ClassicArticle, BasicCellArticle } from '#common/Article';
import type { Cell } from "#/components/cell-editor/cell";

import type { Article } from '#/components/cell-editor/types';

interface NacomDB extends DBSchema {
    drafts: {
        key: string, // primary key localIndex
        value: Article,
        indexes: {
            'localIndex': string,
        }
    },
    articles: {
        key: string, // primary key localIndex
        value: Article,
        indexes: {
            'localIndex': string,
            'publicIndex': string, // secondary keys
        },
    },
}


async function _create(){
    const db = await openDB<NacomDB>('nacom-db', /* version: */ 1, {
        upgrade: (db, oldVersion) => {

            // versions are linear; no breaks inside switch
            switch(oldVersion){
            case 0:
                const DraftStore = db.createObjectStore('drafts', { keyPath: 'localIndex' });
                DraftStore.createIndex('localIndex', 'localIndex');

                const ArticleStore = db.createObjectStore('articles', { keyPath: 'localIndex' });
                ArticleStore.createIndex('localIndex', 'localIndex');
                ArticleStore.createIndex('publicIndex', 'publicIndex');

                // store.createIndex(indexName, keyPath)
            }
        },
    })

    return db;
}

let promise: ReturnType<typeof _create> | undefined = undefined;

export default function getDB() /* : ReturnType<typeof _create> */
{
    if(!promise){
        promise = _create();
    }
    return promise;
}