
import { BubbleType } from './types/declaration'

interface Bubble {
    type : BubbleType;
    value? : unknown;
    label? : string;
    children? : Bubble[];
}

interface FlatBubbleEntity {
    id : string; //possibly unnecessary??
    type : BubbleType;
    value? : unknown;
    label? : string;
    parentId? : string; //for manipulation.
    childrenId? : string[];
}

type FlatBubbleRecord = Record<string, FlatBubbleEntity>;
interface FlatBubble{
    rootId : string;
    record : FlatBubbleRecord;
}

function prefixFlatBubble(fb : FlatBubble, prefix : string) : FlatBubble{
    var fbr : FlatBubbleRecord = {};
    for(var id in fb.record){
        var fbe = { ...fb.record[id] }; //make a copy (shallow)

        fbe.id = prefix + fbe.id;
        if(typeof fbe.parentId !== 'undefined'){
            fbe.parentId = prefix + fbe.parentId;
        }
        if(typeof fbe.childrenId !== 'undefined'){
            fbe.childrenId = fbe.childrenId.map( id => (prefix+id) );
        }

        fbr[prefix + id] = fbe;
    }
    return {
        rootId : prefix + fb.rootId,
        record : fbr
    };
}

function flatten(bubble : Bubble) : FlatBubble{
    var {children, ...others} = bubble;

    if(typeof children !== 'undefined'){
        var fbr : FlatBubbleRecord = {};
        var childrenId : string[] = [];
        var counter = 0;
        for(var child of children){
            var flatChild = prefixFlatBubble(flatten(child), '_' + String(counter));
            counter++;

            childrenId.push(flatChild.rootId);
            flatChild.record[flatChild.rootId].parentId = '_';

            fbr = {...fbr, ...flatChild.record};
        }
        return {
            rootId : '_',
            record : {
                '_' : {id : '_', childrenId, ...others},
                ...fbr
            }
        }
    }
    else{
        return {
            rootId : '_',
            record : {
                '_' : { id : '_', ...others }
            }
        };
    }
}

function inflate(fb : FlatBubble) : Bubble{
    var {rootId, record} = fb;
    try{
        var {id, parentId, childrenId, ...others} = record[rootId]; //id, parentId : discharge
        if (typeof childrenId !== 'undefined'){
            var children = childrenId.map((childId)=>{
                return inflate({ rootId : childId, record });
            });
            return { ...others, children };
        }
        else return { ...others };
    }
    catch (e){
        return {
            type: 'text', //ERROR HANDLER SOMEWHERE?
            value: '[Error : Invalid FlatBubble]'
        };
    }
}

function getCounter(fb: FlatBubble) : number{
    return Math.max.apply(
        null,
        Object.keys(fb.record).map(parseInt)
            .filter((n)=>!isNaN(n))
            .concat(0)
    );
}

function findSibling(fb: FlatBubble, id: string, delta: number) : string{
    const pid = fb.record[id].parentId;
    if( typeof pid === 'undefined' ) return id;

    const siblingId = fb.record[pid].childrenId || [];
    const n = siblingId.indexOf(id);
    if( n === -1) return id; //something went wrong here, but no handling

    return siblingId[n + delta];
}


export type { Bubble, FlatBubble };
export {
    flatten, inflate,
    prefixFlatBubble, getCounter,
    findSibling
};