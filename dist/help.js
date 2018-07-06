"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cjk = require("cjk-regex");
const ansi = require('ansi-regex');
const ansiRegexG = ansi();
const cjkRegex = cjk().toRegExp();
function parseDisplayLength(str) {
    let length = 0;
    str = str.replace(ansiRegexG, '');
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        let code = str.codePointAt(i);
        if (code > 0xffff) {
            char = String.fromCodePoint(code);
            i += 1;
        }
        if (char === '\r' || char === '\n') {
            length = 0;
        }
        else if (cjkRegex.test(char)) {
            length += 2;
        }
        else {
            length += 1;
        }
    }
    return length;
}
exports.parseDisplayLength = parseDisplayLength;
//# sourceMappingURL=help.js.map