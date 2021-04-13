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
    <K extends keyof O>(type: K, ...args: NormalNotationArgs<OmitFirstParam<O[K]>, Opt>): Ret;
    <K extends keyof O>(payloadWithType: { type: K } & ObjectNotationArgs<OmitFirstParam<O[K]>[0]>, options?: Opt): Ret;

    (type: string, payload: any, options: Opt & { root: true }): Ret;
    (payloadWithType: { type: string }, options: Opt & { root: true }): Ret;
}

export type MethodWithoutFirstParam<Func extends (...args: any[]) => any, RetVal> = (...args: OmitFirstParam<Func>) => RetVal

export type WrapInPromise<P> = P extends Promise<any> ? P : Promise<P>

type NormalNotationArgs<Payload extends ReadonlyArray<any>, Opt extends Options> =
    Payload extends []
        ? [payload: undefined, options?: Opt]
        : [...payload: Payload, options?: Opt]

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
