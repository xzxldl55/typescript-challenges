/**
 * Promise相关异步类型
 *
 * 189. Awaited：假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。
 * 20. PromiseAll：键入函数PromiseAll，它接受PromiseLike对象数组，返回值应为Promise<T>，其中T是解析的结果数组。
 */

// 189
type MyAwaited<T extends Promise<any>> = T extends Promise<infer X> ? X : T;

type ExampleType = Promise<string>;
type ResultMyAwait = MyAwaited<ExampleType>;

// 20
declare function PromiseAll<T extends unknown[]>(
    value: readonly [...T]
): Promise<{ [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P] }>;

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const);
