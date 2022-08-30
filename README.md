# typescript-challenges

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P]
}
type TupleToObject<T extends readonly (number | string)[]> = {
    [P in T[number]]: P
}
type First<T extends any[]> = T['length'] extends 0 ? never : T[0]
type Length<T extends readonly any[]> = T['length']
type MyExclude<T, U> = T extends U ? never : T;
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer X> ? (X extends Promise<unknown> ? MyAwaited<X> : X) : T
declare function PromiseAll<T extends unknown[]> (
    value: readonly [...T]
): Promise<{ [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P] }>
/**
 * 
// 另一个思路：本题的解题思路在于需要对数组的每一项进行递归判断，主要判断每一项是否是 Promise，如果是则需要递归取出 Promise 的返回值，否则继续进行下一项。
//       因为最终的结果返回的 Promise，所以需要单独写一个 Type 进行内部的递归，最后再返回给 PromiseAll；
type SettleAll<T extends readonly any[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends Promise<infer R>
    ? [R, ...SettleAll<Rest>]
    : [First, ...SettleAll<Rest>]
  : [];

declare function PromiseAll<T extends any[]>(
  values: readonly [...T]
): Promise<SettleAll<[...T]>>;
 */
type If<C extends boolean, T, F> = C extends true ? T : F
type Concat<A1 extends any[], A2 extends any[]> = [...A1, ...A2]
type Includes<T extends any[], K> = K extends T[number] ? true : false
type Push<T extends any[], U> = [...T, U]
type Unshift<T extends any[], U> = [U, ...T]
type Pop<T extends any[]> = T extends [...infer M, infer N] ? M : never
type Shift<T extends any[]> = T extends [infer M, ...infer N] ? N : never
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer X) => any ? X : never
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer X ? X : never
type Equal<T, U> = T extends U ?
    (U extends T ?
        true :
        false) :
    false
type MyOmit<T extends object, K extends keyof T> = {
    [P in MyExclude<keyof T, K>]: T[P]
}
type MyReadonly2<T extends object, K extends keyof T = keyof T> = {
    readonly [P in K]: T[K]
} & {
    [U in keyof T as (U extends K ? never :U)]:T[U]
}
/**
 * 
下面可直接转换
{
    [U in keyof T as (U extends K ? never :U)]:T[U]
}
==>
MyOmit<T, K>
 */
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Function ? 
        T[P] : 
        T[P] extends object ?
            DeepReadonly<T[P]> : 
            T[P]
}
type TupleToUnion<T extends readonly (number | string)[]> = T[number]
type Chainable<T = {}> = {
    option<K extends string, V>(
      key: K,
      value: V
    ): Chainable<T & Record<K, V>>
    get(): T
}
// type Last<T extends any[]> = T extends [...infer L, infer R] ? R : never
type Last<T extends any[]> = [any, ...T][T['length']] // 在头部塞一个任意值，令前者长度 + 1，然后获取T[length]的值即可
```
