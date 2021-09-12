// 2021/09/11
// Slight modification of https://github.com/micromark/micromark-extension-directive/blob/main/dev/lib/directive-container.js

import assert from 'assert';
import { factorySpace } from 'micromark-factory-space';
import { markdownLineEnding, asciiAlpha, asciiAlphanumeric } from 'micromark-util-character';

import { Construct, Tokenizer, State, Token, Extension } from 'micromark-util-types'
import { codes } from 'micromark-util-symbol/codes'
import { constants } from 'micromark-util-symbol/constants'
import { types } from 'micromark-util-symbol/types'

const fenceChar = codes.atSign // '@'
const fenceSizeMin = 3 // constants.codeFencedSequenceSizeMin

function wrap(tokenizer : Tokenizer){
    return { tokenize: tokenizer, partial: true };
}

const tokenizeName : Tokenizer = function(effects, ok, nok){
    const self = this;

    const start : State = (code) => {
        if(asciiAlpha(code)){
            effects.enter('textboxName');
            effects.consume(code);
            return name;
        }
        return nok(code);
    }

    const name : State = (code) => {
        if(
            code === codes.dash ||
            code === codes.underscore ||
            asciiAlphanumeric(code)
        ) {
            effects.consume(code);
            return name;
        }

        effects.exit('textboxName');
        return self.previous === codes.dash || self.previous === codes.underscore ? nok(code) : ok(code);
        // return ok(code);
    }

    return start;
}

const tokenizeLabel : Tokenizer = function(effects, ok, nok){
    let size = 0;
    let balance = 0;

    const start : State = (code) => {
        assert(code === codes.leftSquareBracket, 'expected `[`');
        effects.enter('textboxLabel');
        effects.enter('textboxLabelMarker');
        effects.consume(code);
        effects.exit('textboxLabelMarker');
        return afterStart;
    }

    const afterStart : State = (code) => {
        if (code === codes.rightSquareBracket){
            effects.enter('textboxLabelMarker');
            effects.consume(code);
            effects.exit('textboxLabelMarker');
            effects.exit('textboxLabel');
            return ok;
        }
        effects.enter('textboxLabelString');
        return atBreak(code);
    }

    const atBreak : State = (code) => {
        if (
            code === codes.eof ||
            markdownLineEnding(code) ||
            size > constants.linkReferenceSizeMax
        ){
            return nok(code);
        }
        if (code === codes.rightSquareBracket && !balance--){
            return atClosingBrace(code);
        }
        effects.enter(types.chunkText, {contentType : constants.contentTypeText});
        return label(code);
    }

    const atClosingBrace : State = (code) => {
        effects.exit('textboxLabelString');
        effects.enter('textboxLabelMarker');
        effects.consume(code);
        effects.exit('textboxLabelMarker');
        effects.exit('textboxLabel');
        return ok;
    }

    const label : State = (code) => {
        if(
            code === codes.eof ||
            markdownLineEnding(code) ||
            size > constants.linkReferenceSizeMax
        ){
            effects.exit(types.chunkText);
            return atBreak(code); // return nok(code);
        }

        if(
            code === codes.leftSquareBracket &&
            ++balance > constants.linkResourceDestinationBalanceMax
        ){
            return nok(code);
        }
        if (code === codes.rightSquareBracket && !balance--){
            return atClosingBrace(code);
        }

        effects.consume(code);
        return code === codes.backslash ? labelEscape : label;
    }

    const labelEscape : State = (code) => {
        if(
            code === codes.leftSquareBracket ||
            code === codes.backslash ||
            code === codes.rightSquareBracket
        ) {
            effects.consume(code);
            size++;
            return label;
        }

        return label(code);
    }


    return start;
}

const tokenizeNonLazyLine : Tokenizer = function(effects, ok, nok){
    const self = this;

    const start : State = function(code){
        assert(markdownLineEnding(code), 'expected eol');
        effects.enter(types.lineEnding);
        effects.consume(code);
        effects.exit(types.lineEnding);
        return lineStart;
    }

    const lineStart : State = function(code){
        return self.parser.lazy[self.now().line] ? nok(code) : ok(code);
    }

    return start;
}

const tokenizeTextbox : Tokenizer = function(effects, ok, nok){
    const self = this;
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

        return effects.attempt(wrap(tokenizeName.bind(self)),afterName,nok)(code);
        // return tokenizeName.call(self, effects, afterName, nok)(code);
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
        )(code);
    }

    const chunkStart : State = (code) => {
        if(code === codes.eof){
            return after(code);
        }

        const token = effects.enter(types.chunkDocument, {
            contentType: constants.contentTypeDocument,
            previous
        })
        if(previous) previous.next = token;
        previous = token;
        return contentContinue(code);
    }

    const contentContinue : State = (code) => {
        if(code === codes.eof){
            const t = effects.exit(types.chunkDocument);
            self.parser.lazy[t.start.line] = false;
            return after(code);
        }

        if(markdownLineEnding(code)){
            return effects.check(wrap(tokenizeNonLazyLine), nonLazyLineAfter, lineAfter)(code);
        }

        effects.consume(code);
        return contentContinue;
    }

    const nonLazyLineAfter : State = (code) => {
        effects.consume(code);
        const t = effects.exit(types.chunkDocument);
        self.parser.lazy[t.start.line] = false;
        return lineStart;
    }

    const lineAfter : State = (code) => {
        const t = effects.exit(types.chunkDocument);
        self.parser.lazy[t.start.line] = false;
        return after(code);
    }
    
    const after : State = (code) => {
        effects.exit('textboxContent');
        effects.exit('textbox');
        return ok(code);
    }

    const tokenizeClosingFence : Tokenizer = (effects, ok, nok) => {
        let size = 0;

        const closingPrefixAfter : State = (code) => {
            effects.enter('textboxFence');
            effects.enter('textboxSequence');
            return closingSequence(code);
        }

        const closingSequence : State = (code) => {
            if(code === fenceChar){
                effects.consume(code);
                size++;
                return closingSequence;
            }

            if(size < sizeOpen) return nok(code);
            effects.exit('textboxSequence');
            return factorySpace(effects, closingSequenceEnd, types.whitespace)(code);
        }

        const closingSequenceEnd : State = (code) => {
            if(code === codes.eof || markdownLineEnding(code)) {
                effects.exit('textboxFence');
                return ok(code);
            }
            return nok(code);
        }

        return factorySpace(effects, closingPrefixAfter, types.linePrefix, constants.tabSize);
    }

    return start;
}

const textboxConstruct : Construct = {
    tokenize: tokenizeTextbox,
    concrete: true
}


export function textbox() : Extension {
    return {
        flow : {[fenceChar] : textboxConstruct }
    }
}

// export { textbox, textboxHtml };