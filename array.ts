/**
 * 数组相关类型工具
 *
 * 14. First: 获取第一个元素
 * 15. Last: 实现一个通用Last<T>，它接受一个数组T并返回其最后一个元素的类型。
 * 16. Pop: 实现一个通用Pop<T>，它接受一个数组T，并返回一个由数组T的前length-1项以相同的顺序组成的数组。
 * 18. Length: 获取数组长度
 * 533. Concat: 拼接数组
 * 898. Includes: 查询某个值是否在数组内
 * 3057. Push: 在类型系统里实现通用的 Array.push 。
 * 3060：Unshift: 实现类型版本的 Array.unshift。
 * 296. Permutation: 实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。
 * 459. Flatten: 在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。
 * 949. AnyOf: 在类型系统中实现类似于 Python 中 any 函数。类型接收一个数组，如果数组中任一个元素为真，则返回 true，否则返回 false。如果数组为空，返回 false。
 * 3062. Shift: 实现Array.prototype.shift，取出第一项
 * 3192: Reverse: 实现类型版本的数组反转 Array.reverse
 */

// 14
type First<T extends any[]> = T[0];

type arr1 = ["a", "b", "c"];
type head1 = First<arr1>; // expected to be 'a'

// 15
type Last<T extends any[]> = [any, ...T][Length<T>];

type tail1 = Last<arr1>;

// 16
type Pop<T extends any[]> = T extends [...infer X, any] ? [...X] : never;

type re1 = Pop<arr1>;

// 18
type Length<T extends any[]> = T["length"];

type tesla = ["tesla", "model 3", "model X", "model Y"];
type teslaLength = Length<tesla>; // expected 4

// 533
type Concat<T extends any[], U extends any[]> = [...T, ...U];

type Result = Concat<[1], [2]>; // expected to be [1, 2]

// 898
type Includes<T extends any[], V> = V extends T[number] ? true : false;

type isPillarMen = Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">; // expected to be `false`

// 3057
type Push<T extends any[], V extends any> = [...T, V];

type ResultPush = Push<[1, 2], "3">; // [1, 2, '3']

// 3060
type Unshift<T extends any[], V extends any> = [V, ...T];

type ResultUnshift = Unshift<[1, 2], 0>; // [0, 1, 2,]

// 3062
type Shift<T> = T extends [infer F, ...infer R] ? R : never;

type testShift = Shift<[3, 2, 1]>;

// 296
// 官方文档中，介绍了一种操作，叫 Distributive conditional types
// 简单来说，传入给T extends U中的T如果是一个联合类型A | B | C，则这个表达式会被展开成
// (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)
// [U] extends [never] 而不是 U extends never 因为 U 是联合类型 条件类型会走分配得到的是一个联合类型  不符合期望
type Permutation<T, U = T> = [U] extends [never]
  ? []
  : T extends U
  ? [T, ...Permutation<Exclude<U, T>>]
  : [];

type perm = Permutation<"A" | "B" | "C">; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

// 459
type Flatten<A extends any[]> = A extends [infer F, ...infer O]
  ? [...(F extends any[] ? Flatten<F> : [F]), ...Flatten<O>]
  : [];

type flatten = Flatten<[[1], [2], [3, [4]], [[[5]]]]>; // [1, 2, 3, 4, 5]

// 949
type Falsy =
  | 0
  | ""
  | undefined
  | null
  | { [K in PropertyKey]: never }
  | []
  | false;
type AnyOf<T extends any[]> = T extends [infer F, ...infer R] // 遍历
  ? F extends Falsy
    ? AnyOf<R>
    : true // 出现某个不符合 Falsy则返回true，否则递归继续遍历
  : false;

type Sample1 = AnyOf<[1, "", [1], { a: 1 }]>; // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]>; // expected to be false.

// 3192
type Reverse<T extends any[]> = T extends [...infer F, infer R] ? [R, ...Reverse<F>] : [];

type testReverse = Reverse<['1', '2', '3']>;