// 2021/09/03
// Little modification of https://github.com/micromark/micromark-extension-directive/blob/main/dev/lib/directive-container.js

import assert from 'assert';
import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding } from 'micromark-util-character';

import { Construct, Tokenizer, State, Token } from 'micromark-util-types'
import { codes } from 'micromark-util-symbol/codes'
import { constants } from 'micromark-util-symbol/constants'
import { types } from 'micromark-util-symbol/types'

const fenceChar = codes.atSign // '@'
const fenceSizeMin = 3 // constants.codeFencedSequenceSizeMin

function wrap(tokenizer : Tokenizer){
    return { tokenize: tokenizer, partial: true };
}

const tokenizeName : Tokenizer = (effects, ok, nok) => {
    ////////// WIP
    return nok;
}

const tokenizeLabel : Tokenizer = (effects, ok, nok) => {
    ////////// WIP
    return nok;
}

const tokenizeNonLazyLine : Tokenizer = (effects, ok, nok) => {
    ////////// WIP
    return nok;
}

const tokenizeTextbox : Tokenizer = (effects, ok, nok) => {
    const self : any = this;
    const tail = self.events[self.events.length - 1];
    const initialSize =
        tail && tail[1].type === types.linePrefix
            ? tail[2].sliceSerialize(tail[1], true).length
            : 0
    // what's this?

    let sizeOpen = 0;
    let previous : Token;

    const start : State = (code) => {
        assert(code === fenceChar, 'expected `@`');
        effects.enter('textbox');
        effects.enter('textboxFence');
        effects.enter('textboxSequence');
        return sequenceOpen(code);
    }

    const sequenceOpen : State = (code) => {
        if(code === fenceChar){
            effects.consume(code);
            sizeOpen++;
            return sequenceOpen;
        }
        if(sizeOpen < fenceSizeMin){
            return nok(code);
        }
        effects.exit('textboxSequence');

        return effects.attempt(wrap(tokenizeName),afterName,nok)(code);
    }

    const afterName : State = (code) => {
        return code === codes.leftSquareBracket
            ? effects.attempt(wrap(tokenizeLabel), afterLabel, afterLabel)(code)
            : afterLabel(code)
    }

    const afterLabel : State = (code) => {
        return factorySpace(effects, openAfter, types.whitespace)(code)
    }

    const openAfter : State = (code) => {
        effects.exit('textboxFence');

        if(code === codes.eof){
            return afterOpening(code);
        }

        if(markdownLineEnding(code)){
            if(self.interrupt) return ok(code);
            return effects.attempt(wrap(tokenizeNonLazyLine),contentStart, afterOpening)(code);
        }

        return nok(code);
    }

    const afterOpening : State = (code) => {
        effects.exit('textbox');
        return ok(code);
    }

    const contentStart : State = (code) => {
        if(code === codes.eof){
            effects.exit('textbox');
            return ok(code);
        }
        effects.enter('textboxContent');
        return lineStart(code);
    }

    const lineStart : State = (code) => {
        if(code === codes.eof){
            return after(code);
        }

        return effects.attempt(
            wrap(tokenizeClosingFence),
            after,
            initialSize
                ? factorySpace(effects, chunkStart, types.linePrefix, initialSize + 1)
                : chunkStart
        )(code)
    }

    const chunkStart : State = (code) => {
        ///////////////// WIP
    }

    const contentContinue : State = (code) => {
        ///////////////// WIP
    }

    const nonLazyLineAfter : State = (code) => {
        ///////////////// WIP
    }

    const lineAfter : State = (code) => {
        ///////////////// WIP
    }
    
    const after : State = (code) => {
        effects.exit('textboxContent');
        effects.exit('textbox');
        return ok(code);
    }

    const tokenizeClosingFence : Tokenizer = (effects, ok, nok) => {
        //////////////// WIP
        return nok;
    }

    return start;
}

