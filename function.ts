/**
 * 函数工具类型
 *
 * 2. ReturnType：返回函数的返回值类型
 * 3312. Parameters：实现内置的 Parameters 类型，而不是直接使用它，可获得函数的参数类型列表
 * 3196. FlipArguments: 实现类似 _.filp 的函数，能够翻转函数的参数
 */

const foo = (arg1: string, arg2: number) => {
  if (arg1 === '1') {
    return 1;
  } else {
    return 2;
  }
};

// 2
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

type a = MyReturnType<typeof foo>; // 1 | 2

// 3312
type MyParameters<T extends (...args: any) => any> = T extends (
  ...args: infer R
) => any
  ? R
  : never;

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]

// 3196
type ReverseParams<T extends any[]> = T extends [infer F, ...infer R]
  ? [...ReverseParams<R>, F]
  : [];
type FlipArguments<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => infer R
  ? (...args: ReverseParams<P>) => R
  : never;

type testFilpArguments = FlipArguments<typeof foo>;
