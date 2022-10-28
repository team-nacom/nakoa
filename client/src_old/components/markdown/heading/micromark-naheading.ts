// 2021/11/25
// Slight modification of https://github.com/micromark/micromark/blob/main/packages/micromark-core-commonmark/dev/lib/heading-atx.js

// note : the second ## of `## TITLE ##` does not disappear in this version(unlike CommonMark)

import assert from 'assert';
import { factorySpace } from 'micromark-factory-space';
import { factoryWhitespace } from 'micromark-factory-whitespace';
import { markdownLineEnding, markdownLineEndingOrSpace, asciiAlpha, asciiAlphanumeric, markdownSpace } from 'micromark-util-character';

import { Construct, Tokenizer, State, Token, Extension } from 'micromark-util-types'
import { codes } from 'micromark-util-symbol/codes'
import { constants } from 'micromark-util-symbol/constants'
import { types } from 'micromark-util-symbol/types'
import { start } from 'repl';
import { title } from 'process';

import { codePriority } from './priority'

const tokenizeNaHeading : Tokenizer = function(effects, ok, nok){
    const self = this;
    let size = 0;

    const start : State = (code) => {
        assert(code === codes.numberSign, 'expected `#');
        effects.enter('naHeading');
        effects.enter('naHeadingSequence');
        return fenceOpenInside(code);
    }

    const fenceOpenInside : State = (code) => {
        if( code === codes.numberSign &&
            size++ < 6
        ){
            effects.consume(code);
            return fenceOpenInside;
        }
        if( code && typeof codePriority[code] !== 'undefined'
            // && codePriority[code] !== -1
        ){
            effects.exit('naHeadingSequence');
            effects.enter('naHeadingPriority');
            effects.consume(code);
            effects.exit('naHeadingPriority');

            return afterPriority;
        }

        if( code === codes.eof || markdownLineEndingOrSpace(code)){
            effects.exit('naHeadingSequence');
            effects.enter('naHeadingPriority');
            effects.exit('naHeadingPriority'); // this effect (empty token) should be here: blank priority means Essential.

            return self.interrupt ? ok(code) : headingBreak(code);
        }

        return nok(code);
    }

    const afterPriority : State = (code) => {
        if( code === codes.eof || markdownLineEndingOrSpace(code) ){
            return self.interrupt ? ok(code) : headingBreak(code);
        }
        return nok(code);
    }

    const headingBreak : State = (code) => {
        if( code === codes.eof || markdownLineEnding(code)){
            effects.exit('naHeading');
            return ok(code);
        }

        if(markdownSpace(code)){
            return factorySpace(effects, headingBreak, types.whitespace)(code);
        }
        effects.enter('naHeadingTitle');
        effects.enter(types.chunkText, {contentType : constants.contentTypeText});
        return title(code);
    }

    const title : State = (code) => {
        if( code === codes.eof || markdownLineEnding(code)){
            effects.exit(types.chunkText);
            effects.exit('naHeadingTitle');
            effects.exit('naHeading');
            return ok(code);
        }

        effects.consume(code);
        return title;
    }

    return start;
}

const headingConstruct : Construct = {
    tokenize: tokenizeNaHeading,
    concrete: true
}

export function naHeading() : Extension {
    return {
        flow : {[codes.numberSign] : headingConstruct }
    }
}
