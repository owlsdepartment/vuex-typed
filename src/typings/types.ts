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
    <K extends keyof O>(type: K, ...args: NormalNotationArgs<OmitFirstParam<O[K]>[0], Opt>): Ret;
    <K extends keyof O>(payloadWithType: { type: K } & ObjectNotationArgs<OmitFirstParam<O[K]>[0]>, options?: Opt): Ret;

    (type: string, payload: any, options: Opt & { root: true }): Ret;
    (payloadWithType: { type: string } & Record<string, any>, options: Opt & { root: true }): Ret;
}

export type MethodWithoutFirstParam<Func extends (...args: any[]) => any, RetVal> = (...args: OmitFirstParam<Func>) => RetVal

export type WrapInPromise<P> = P extends Promise<any> ? P : Promise<P>

// can used labeled tuples in proper TS version
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

export type OmitFirstParam<T extends (...args: any) => any> = T extends (_: any, ...args: infer Rest) => any ? Rest : never;
