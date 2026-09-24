"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSubmissionParser = void 0;
class TextSubmissionParser {
    parse(content) {
        const classes = [];
        const patternRegex = /(strategy|factory|singleton|observer|decorator|adapter|facade|builder|proxy|state)/gi;
        const mentionedPatterns = [...new Set(Array.from(content.matchAll(patternRegex), m => m[1].toLowerCase()))];
        const classBlocks = content.split(/class\s+|interface\s+/).slice(1);
        for (const block of classBlocks) {
            const lines = block.split('\n');
            const classNameMatch = lines[0].match(/([A-Za-z0-9_]+)/);
            if (!classNameMatch)
                continue;
            const name = classNameMatch[1];
            const methodsRegex = /([A-Za-z0-9_]+)\s*\(/g;
            const methods = [];
            let m;
            while ((m = methodsRegex.exec(block)) !== null) {
                methods.push(m[1]);
            }
            classes.push({
                name,
                methods: [...new Set(methods.filter(mn => mn !== name && mn !== 'if' && mn !== 'for' && mn !== 'while' && mn !== 'List' && mn !== 'Set'))]
            });
        }
        return {
            classes,
            mentionedPatterns,
            rawText: content
        };
    }
}
exports.TextSubmissionParser = TextSubmissionParser;
