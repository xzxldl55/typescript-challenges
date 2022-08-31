/**
 * 数组相关类型工具
 * 
 * 14. First：获取第一个元素
 * 15. Last：实现一个通用Last<T>，它接受一个数组T并返回其最后一个元素的类型。
 * 16. Pop：实现一个通用Pop<T>，它接受一个数组T，并返回一个由数组T的前length-1项以相同的顺序组成的数组。
 * 18. Length：获取数组长度
 * 533. Concat：拼接数组
 * 898. Includes：查询某个值是否在数组内
 * 3057. Push：在类型系统里实现通用的 Array.push 。
 * 3060：Unshift：实现类型版本的 Array.unshift。
 * 296. Permutation：实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。
 */

// 14
type First<T extends any[]> = T[0];

type arr1 = ['a', 'b', 'c'];
type head1 = First<arr1>; // expected to be 'a'

// 15
type Last<T extends any[]> = [any, ...T][Length<T>];

type tail1 = Last<arr1>;

// 16
type Pop<T extends any[]> = T extends [...infer X, any] ? [...X] : never;

type re1 = Pop<arr1>

// 18
type Length<T extends any[]> = T['length'];

type tesla = ['tesla', 'model 3', 'model X', 'model Y'];
type teslaLength = Length<tesla>; // expected 4

// 533
type Concat<T extends any[], U extends any[]> = [...T, ...U];

type Result = Concat<[1], [2]>; // expected to be [1, 2]

// 898
type Includes<T extends any[], V> = V extends T[number] ? true : false;

type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`

// 3057
type Push<T extends any[], V extends any> = [...T, V];

type ResultPush = Push<[1, 2], '3'> // [1, 2, '3']

// 3060
type Unshift<T extends any[], V extends any> = [V, ...T];

type ResultUnshift = Unshift<[1, 2], 0> // [0, 1, 2,]

// 296
// type Permutation<T> = 

// type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']