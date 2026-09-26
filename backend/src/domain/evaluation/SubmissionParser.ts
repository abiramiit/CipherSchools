export interface ClassMetadata {
    name: string;
    methods: string[];
}

export interface ParsedSubmission {
    classes: ClassMetadata[];
    mentionedPatterns: string[];
    rawText: string;
}

export interface SubmissionParser {
    parse(content: string): ParsedSubmission;
}

export class TextSubmissionParser implements SubmissionParser {
    parse(content: string): ParsedSubmission {
        const classes: ClassMetadata[] = [];
        const patternRegex = /(strategy|factory|singleton|observer|decorator|adapter|facade|builder|proxy|state)/gi;
        const mentionedPatterns = [...new Set(Array.from(content.matchAll(patternRegex), m => m[1].toLowerCase()))];

        const classBlocks = content.split(/class\s+|interface\s+/).slice(1);

        for (const block of classBlocks) {
            const lines = block.split('\n');
            const classNameMatch = lines[0].match(/([A-Za-z0-9_]+)/);
            if (!classNameMatch) continue;
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

        // Fallback: If no classes were detected via strict keyword parsing, attempt to parse plain-text lists
        if (classes.length === 0) {
            const lines = content.split('\n');
            let currentClass: ClassMetadata | null = null;

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                const isIndented = line.startsWith(' ') || line.startsWith('\t');
                const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*');

                // If it's a root alphanumeric word, treat it as a Class definition
                if (!isIndented && !isBullet && /^[A-Za-z][A-Za-z0-9_]*$/.test(trimmed)) {
                    if (currentClass) classes.push(currentClass);
                    currentClass = { name: trimmed, methods: [] };
                }
                // Alternatively, if they wrote something like "Entity: User", try to capture it
                else if (!isIndented && /^[A-Za-z][A-Za-z0-9_]*:$/.test(trimmed)) {
                    if (currentClass) classes.push(currentClass);
                    currentClass = { name: trimmed.replace(':', ''), methods: [] };
                }
                else if (currentClass) {
                    const methodsRegex = /([A-Za-z0-9_]+)\s*\(/g;
                    let m;
                    while ((m = methodsRegex.exec(trimmed)) !== null) {
                        currentClass.methods.push(m[1]);
                    }
                }
            }
            if (currentClass) classes.push(currentClass);
        }

        return {
            classes,
            mentionedPatterns,
            rawText: content
        };
    }
}
