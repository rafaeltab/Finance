import type { Bracket } from "#src/util/brackets";
import { createRegexes, replaceUnknown } from "#src/util/regexes";

describe("regexes", () => {
    it("Given a supported bracket and an object containing a replaceable string with the same bracket when replaceUnknown is called with regexes coming from createRegexes then it should replace the string correctly", () => {
        function* dataGenerator(){
            yield ["{", "{coolReplace}"] as const;
            yield ["[", "[coolReplace]"] as const;
            yield ["(", "(coolReplace)"] as const;
            yield ["<", "<coolReplace>"] as const;
        }

        function test(bracket: Bracket, data: string){
            
            const regexes = createRegexes(bracket);

            const obj = {
                replace: `${data}`
            }

            const context = {
                coolReplace: "replacedWithStuff"
            }

            const result = replaceUnknown(obj, context, regexes);

            expect(result).toEqual({
                replace: "replacedWithStuff"
            })
        }

        for(const data of dataGenerator()){
            test(data[0], data[1]);
        }

    });
   

    it("Given a { bracket and a complex object containing replaceable strings with the same bracket when replaceUnknown is called with regexes coming from createRegexes then it should replace the the strings correctly", () => {
        const regexes = createRegexes("{");

        const obj = {
            replace: [
                {
                    "{coolReplace}": "{coolReplace}yes",
                    "{{coolReplace}}": "yes"
                },
                {
                    "[coolReplace]": "{coolReplace}"
                }
            ],
            0: "{coolReplace}"
        }

        const context = {
            coolReplace: "replacedWithStuff"
        }

        const result = replaceUnknown(obj, context, regexes);

        expect(result).toEqual({
            replace: [
                {
                    "replacedWithStuff": "replacedWithStuffyes",
                    "{coolReplace}": "yes"
                },
                {
                    "[coolReplace]": "replacedWithStuff"
                }
            ],
            0: "replacedWithStuff"
        })
    })
});
