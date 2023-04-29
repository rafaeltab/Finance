import { Bracket, bracketMap } from "./brackets";

export type ReplaceRegexes = {
    doubleQuote: RegExp,
    singleQuote: RegExp
}

function replaceString(str: string, mapping: Record<string, string>, regexes: ReplaceRegexes) {
    const singleReplacedStr = str.replace(regexes.singleQuote, (match, ...groups: string[]) => {
        const p1 = groups[2]; // This is where the actual group is

        if(p1 === undefined) return match;

        const key = p1.substring(1, p1.length - 1);
        const val = mapping[key] !== undefined ? mapping[key] ?? match : match;
        return match.replace(p1, val);
    });

    return singleReplacedStr.replace(regexes.doubleQuote, match => match.substring(1, match.length - 1));
}

export function replaceUnknown(val: unknown, mapping: Record<string, string>, regexes: ReplaceRegexes): unknown {
    if (typeof val === "string") return replaceString(val, mapping, regexes);

    if (typeof val !== "object" || val === null) return val;

    if (Array.isArray(val)) {
        return val.map(elem => replaceUnknown(elem, mapping, regexes));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.entries(val).reduce((acc: any, [key, value]): any => {
        acc[key] = replaceUnknown(value, mapping, regexes);

        const newKey = replaceString(key, mapping, regexes);
        if (newKey !== key) {
            acc[newKey] = acc[key];
            delete acc[key];
        }

        return acc;
    }, {});
}

export function createRegexes(bracket: Bracket): ReplaceRegexes {
    const closeBracket = bracketMap[bracket];

    const baseDoubleRegString = "\\OPEN\\OPEN[^\\OPEN\\CLOSE]*\\CLOSE\\CLOSE";
    // eslint-disable-next-line max-len
    const baseSingleRegString = "(?:(?<!\\OPEN)(\\OPEN[^\\OPEN\\CLOSE]+\\CLOSE)(?:\\CLOSE))|(?:(?:\\OPEN)(\\OPEN[^\\OPEN\\CLOSE]+\\CLOSE)(?!\\CLOSE))|(?:(?<!\\OPEN)(\\OPEN[^\\OPEN\\CLOSE]+\\CLOSE)(?!\\CLOSE))";

    const doubleRegString = baseDoubleRegString.replaceAll("OPEN", bracket).replaceAll("CLOSE", closeBracket);
    const singleRegString = baseSingleRegString.replaceAll("OPEN", bracket).replaceAll("CLOSE", closeBracket);

    return {
        doubleQuote: new RegExp(doubleRegString, "g"),
        singleQuote: new RegExp(singleRegString, "g")
    }
}
