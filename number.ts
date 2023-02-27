/**
 * 数字相关
 *
 * 529. Absolute：接收string，number，bigint类型，返回绝对值
 * 531. String to Union：字符串转换为单字符的联合类型
 * 2257. MinusOne: 给定一个正整数作为类型的参数，要求返回的类型是该数字减 1。
 * 300. String to Number: 给出一个字符串数字，将其转换成数字类型，类似 Number.parseInt
 */

// 529
type Absolute<N extends string | number | bigint> =
    `${N}` extends `${infer S}${infer R}`
        ? `${S extends '-' ? '' : S}${R}`
        : '';

type testAbsolute = Absolute<-1515>;

// 531
type StringToUnion<S extends string> = S extends `${infer F}${infer R}` // 字面量 + infer定义，递归
    ? [F, ...StringToUnion<R>]
    : [];
type testStringToUnion = StringToUnion<'123'>; // expected to be "1" | "2" | "3"

// 2257
// type MinusOne<T extends number> =

// 300
// 递归塞0到数组里面做占位，直到R数组长度就等于我们数字T的大小，返回R
export type StringToNumber<
    S extends string,
    Res extends any[] = []
> = S extends `${number}` // 这里借用extends来遍历联合类型 & 能够监测S的类型确保是数字字符串
    ? S extends `${Res['length']}` // 递归跳出条件，S等于我们占位数组大小
        ? Res['length']
        : StringToNumber<S, [...Res, 0]> // 递归调用，不断增加Res数组长度，直到满足条件
    : never;

type TestStringToNumber = StringToNumber<'19' | '20' | '31'>;
