import { ObjectWithMethods } from "@/typings/types";

export class WithHelpers<Base extends ObjectWithMethods> {
    static wrap<B extends ObjectWithMethods>(obj: B) {
        return new WithHelpers(obj) as WithHelpers<B> & B
    }

    private constructor(obj: Base) {
        if ('map' in obj) {
            console.error(
                '[vuex-typed] Method `map` is present in passed object. This behaviour is not intended as it will override helper method `map`.'
            )
        }

        Object.assign(this, obj)
    }

    // order matters, for IDE
    public map<Map extends Record<string, keyof Base>>(keys: Map): { [K in keyof Map]: Base[Map[K]] };
    public map<Keys extends keyof Base>(keys: Keys[]): { [K in Keys]: Base[K] };
    public map(this: Base, keys: Record<string, string> | string[]) {
        if (Array.isArray(keys)) {
            return keys.reduce((acc, key) => {
                if (this[key]) {
                    (acc as any)[key] = this[key]
                }
    
                return acc
            }, {})
        } else {
            const out: Record<keyof typeof keys, (...args: any[]) => any> = {}

            for (const [outputKey, baseKey] of Object.entries(keys)) {
                if (this[baseKey]) {
                    out[outputKey] = this[baseKey]
                }
            }

            return out
        }
    }
}
