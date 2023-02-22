/**
 * 元组相关
 *
 * 10. 元组转合集：实现泛型TupleToUnion<T>，它返回元组所有值的合集。
 * 11. 元组转对象：传入一个元组类型，将这个元组类型转换为对象类型，这个对象类型的键/值都是从元组中遍历出来。
 * 3188. TupleToNestedObject: 给出一个仅包含字符串类型的元组T，并给出类型U，要求按照嵌套规则将其转为对象类型 (['a', 'b', 'c'], string) --> {a: {b: {c: string}}}
 */

// 11 直接返回元组的所有值，其结果会自动取联合类型
type TupleToUnion<T extends readonly (number | string)[]> = T[number];

type Arr = ["1", "2", "3"];
type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'

// 10 同理直接返回T[number]同时作为 KV 即可
type TupleToObject<T extends readonly (number | string)[]> = {
  [P in T[number]]: P;
};

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;
type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

// 3188
type TupleToNestedObject<T, U> = T extends [infer F extends string, ...infer R]
  ? {
      [P in F]: TupleToNestedObject<R, U>;
    }
  : U;

type testTupleToNestedObjecta = TupleToNestedObject<["a"], string>; // {a: string}
type testTupleToNestedObjectb = TupleToNestedObject<["a", "b"], number>; // {a: {b: number}}
type testTupleToNestedObjectc = TupleToNestedObject<[], boolean>; // boolean. if the tuple is empty, just return the U type
