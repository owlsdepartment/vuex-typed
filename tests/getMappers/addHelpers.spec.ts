import { AddHelpers } from '@/getMappers/addHelpers'

describe('>>> AddHelpers', () => {
    it('has a private constructor', () => {
        // @ts-expect-error
        const instance = new AddHelpers({})
    })

    it('creates instance through a static method', () => {
        const instance = AddHelpers.wrap({})

        expect(instance).toBeInstanceOf(AddHelpers)
    })

    it('preserves passed fields', () => {
        const base = {
            foo() {},
            bar() {}
        }
        const instance = AddHelpers.wrap(base)
        type Expected = {
            foo(): void;
            bar(): void;
            map(arg: Record<string, string> | string[]): object;
        }
        const e: Expected = instance;

        expect(instance.foo).toBe(base.foo)
        expect(instance.bar).toBe(base.bar)
    })

    it('logs error when `map` is passed in config object', () => {
        const spyOnConsole = jest.spyOn(console, 'error').mockImplementation()
        
        AddHelpers.wrap({ map() {} })

        expect(spyOnConsole).toBeCalledTimes(1)
    })

    it('provides `map` helper method', () => {
        const instance = AddHelpers.wrap({})

        expect(instance.map).toBeTruthy()
        expect(typeof instance.map).toBe('function')
    })

    describe('> `map` helper', () => {
        it('returns object with fields specified as Array<string>', () => {
            const base = {
                foo() {},
                bar() {}
            }
            const instance = AddHelpers.wrap(base)
            const mapped = instance.map(['bar'])

            expect(mapped.bar).toBeTruthy()
            expect(typeof mapped.bar).toBe('function')
            expect('foo' in mapped).toBeFalsy()
        })

        it('returns object with fields specified as map object', () => {
            const base = {
                foo() {},
                bar() {}
            }
            const instance = AddHelpers.wrap(base)
            const mapped = instance.map({ baz: 'bar' })

            expect(mapped.baz).toBeTruthy()
            expect(typeof mapped.baz).toBe('function')
            expect('foo' in mapped).toBeFalsy()
            expect('bar' in mapped).toBeFalsy()
        })

        it('allows only base object keys as argument', () => {
            const base = {
                foo() {},
                bar() {}
            }
            const instance = AddHelpers.wrap(base)

            // @ts-expect-error
            const mappedWithArray = instance.map(['none'])
            // @ts-expect-error
            const mappedWithObject = instance.map({ output: 'none' })
        })

        it(`don't append keys that doesn't exist on base instance`, () => {
            const base = {
                foo() {},
                bar() {}
            }
            const instance = AddHelpers.wrap(base)
            const notExistingKey = 'none' as const

            // @ts-ignore
            const mappedWithArray = instance.map([notExistingKey])
            // @ts-ignore
            const mappedWithObject = instance.map({ output: notExistingKey })

            expect(notExistingKey in mappedWithArray).toBeFalsy()
            expect('output' in mappedWithObject).toBeFalsy()
        })
    })
})
