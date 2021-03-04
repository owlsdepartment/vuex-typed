export type Commit<O extends ObjectWithMethods> = Operation<O, CommitOptions, void>

export type Dispatch<O extends ObjectWithMethods> = Operation<O, DispatchOptions, Promise<any>>

interface CommitOptions extends Options {
    silent?: boolean;
}

interface DispatchOptions extends Options { }

interface Options {
    root?: boolean;
}

interface Operation<O extends ObjectWithMethods, Opt extends Options, Ret> {
    <K extends keyof O>(
        type: K,
        ...args: NormalNotationArgs<OptionalSecondParam<O, K>, Opt>
    ): Ret;
    <K extends keyof O>(
        payloadWithType: { type: K } & ObjectNotationArgs<OptionalSecondParam<O, K>>,
        options?: Opt
    ): Ret;

    (type: string, payload: any, options: Opt & { root: true }): Ret;
    (payloadWithType: { type: string }, options: Opt & { root: true }): Ret;
}

type NormalNotationArgs<Payload, Opt extends Options> =
    | Payload extends undefined ? [] : [Payload]
    | [Payload, Opt]

type ObjectNotationArgs<Payload> = Payload extends object
    ? Payload
    : Payload extends undefined
    ? {}
    : never

export interface ObjectWithMethods {
    [k: string]: (...args: any[]) => any
}

export type ExtractGetter<Getter extends ObjectWithMethods> = {
    [K in keyof Getter]: ReturnType<Getter[K]>
}

export type SecondParam<T extends ObjectWithMethods, K extends keyof T> = Parameters<T[K]>[1]

export type OptionalSecondParam<
    T extends ObjectWithMethods, K extends keyof T, O = SecondParam<T, K>
> = O extends undefined
    ? undefined
    : O;

export type FilterUndefined<A> = A extends undefined ? never : A
