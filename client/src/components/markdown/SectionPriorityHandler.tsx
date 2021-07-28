import { notStrictEqual } from 'assert';
import React, { Children } from 'react';

import { Transformer, Plugin } from 'unified';
import { Node, Parent } from 'unist';

const SectionPriorityHandler : Plugin = () => {
    const sectionPriorityHandler : Transformer = (tree, file) => {
        const root = tree as Parent;
        const markers = ['A','B','C','D','E','+'];
        const prio = [1,2,3,4,5,-1];

        for(var nodeno = 0; nodeno < root.children.length; ++nodeno){
            //root.children.length may change during iteration.
            
            const node = root.children[nodeno]

            if(node.type === 'paragraph'
            && 'children' in node
            && Array.isArray(node.children) //no type guards for instances, seriously?
            && node.children[0].type === 'text'){
                const str = node.children[0].value as string;
                
                for(const i in markers){
                    const marker = markers[i] + ' ';
                    const h = str.indexOf(marker);
                    
                    if(h !== -1 && [undefined,'#','##','###','####','#####','######'].indexOf(str.slice(0,h)) !== -1 ){ //indexOf result should be equal to h
                        for(var j = 0; j< node.children.length; j++){
                            if(!node.children[j].value) continue;
                            const k = node.children[j].value.indexOf('\n');
                            if(k !== -1){
                                const N = {
                                    type: 'paragraph',
                                    children: node.children.slice(j+1)
                                } as Parent;
                                N.children.unshift({ type: 'text', value: node.children[j].value.slice(k+1) });

                                node.children[j].value = node.children[j].value.slice(0,k);
                                node.children.splice(j+1); //delete everything from j+1

                                root.children.splice(nodeno+1, 0, N); //insert new node after current one

                                break;
                            }
                        }

                        node.children[0].value = node.children[0].value.slice(h + marker.length).trimStart();
                        node.type = 'heading';
                        node.depth = h;
                        node.priority = prio[i];

                        break;
                    }
                }
            }
            else if(node.type === 'heading'
            && 'children' in node
            && Array.isArray(node.children)){
                //ensuring height
                if(node.children.length === 0){
                    node.children.push({
                        type: 'text',
                        value: '　' //whitespace with height;
                    })
                }
                node.priority = 1; //same as Essential
                // node.priority = -1; //unnumbered
            }
        }
    }

    return sectionPriorityHandler;
}

export default SectionPriorityHandler;