/**
 * 其他工具类型
 *
 * 4. Pick：实现内置的Pick<T, K>工具
 * 43. Exclude：实现内置的Exclude <T, U>类型，但不能直接使用它本身，从联合类型T中排除U的类型成员，来构造一个新的类型。
 * 268. If：实现一个 IF 类型，它接收一个条件类型 C ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型。
 * 1000. Equal：实现Equal<T, K>返回二者是否相等
 * 3. Omit：不使用 Omit 实现 TypeScript 的 Omit<T, K> 泛型，Omit 会创建一个省略 K 中字段的 T 对象。
 * 12. Chainable：你需要提供两个函数 option(key, value) 和 get()。在 option 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 get 获取最终结果。
 * 62. Lookup：有时，您可能希望根据某个属性在联合类型中查找类型，在此挑战中，我们想通过在联合类型Cat | Dog中搜索公共type字段来获取相应的类型。换句话说，在以下示例中，我们期望LookUp<Dog | Cat, 'dog'>获得Dog，LookUp<Dog | Cat, 'cat'>获得Cat。
 * 191. AppendArgument：实现一个泛型 AppendArgument<Fn, A>，对于给定的函数类型 Fn，以及一个任意类型 A，返回一个新的函数 G。G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。
 * 1042. IsNever: 实现一个类型，能够判别传入内容是否为never
 * 1097 ?. IsUnion：实现一个类型，能够判断传入内容是否是一个 Union 联合类型
 * 9999. IsUnknown: 实现一个类型，能够判断传入内容是否为一个 Unknown
 * 99991. IsAny: 实现一个类型，能够判断传入内容是否为一个 Any
 */

// 4
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

type TodoPreview = MyPick<
    {
        title: string;
        description: string;
        completed: boolean;
    },
    'title' | 'completed'
>;
const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
};

// 23
type MyExclude<T, U> = T extends U ? never : T;

type ResultMyExclude = MyExclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'

// 268
type If<C, T, F> = C extends true ? T : F;

type A = If<true, 'a', 'b'>; // expected to be 'a'

// 1000
type Equal<T, U> = T extends U ? (U extends T ? true : false) : false;

type testEqual = Equal<1, 2>;

// 3
type MyOmit<T, K extends keyof T> = {
    [P in MyExclude<keyof T, K>]: T[P];
};

type TestMyOmit = MyOmit<
    {
        title: string;
        description: string;
        completed: boolean;
    },
    'description' | 'title'
>; // { complected: boolean }

// 12
type Chainable<T = {}> = {
    option<K extends string, V extends any>(
        key: K,
        value: V
    ): Chainable<T & Record<K, V>>; // 返回Chainable，传入类型为原 类型T + KV键值对
    get(): T;
};

declare const config: Chainable;
const result = config
    .option('foo', 123)
    .option('name', 'type-challenges')
    .option('bar', { value: 'Hello World' })
    .get();
// 期望 result 自动推断的类型是：
// interface Result {
//   foo: number
//   name: string
//   bar: {
//     value: string
//   }
// }

// 62
type Lookup<T, K> = T extends { type: K } ? T : never; // 直接将类型 K 放到公共属性中，判读 T 是否继承自它即可

interface Cat {
    type: 'cat';
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal';
}
interface Dog {
    type: 'dog';
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
    color: 'brown' | 'white' | 'black';
}
type MyDog = Lookup<Cat | Dog, 'dog'>; // expected to be `Dog`

// 191
type AppendArgument<
    F extends (...args: any[]) => any,
    A extends any
> = F extends (...args: infer R) => infer X ? (...args: [...R, A]) => X : never;

type Fn = (a: number, b: string) => number;
type ResultAppendArgument = AppendArgument<Fn, boolean>;
// 期望是 (a: number, b: string, x: boolean) => number

// 1042
type IsNever<T> = [T] extends [never] ? true : false; // 直接 T extends never ? true : false; 仅会返回 never 故利用 [] 来包裹

type neverA = IsNever<never>; // expected to be true
type neverB = IsNever<undefined>; // expected to be false
type neverC = IsNever<null>; // expected to be false
type neverD = IsNever<[]>; // expected to be false
type neverE = IsNever<any>; // expected to be false

// 1097
type IsUnion<U, C = U> = IsNever<U> extends true
    ? false
    : U extends C
    ? [C] extends [U]
        ? false
        : true
    : false;

type unionCase1 = IsUnion<string>; // false
type unionCase2 = IsUnion<string | number>; // true
type unionCase3 = IsUnion<[string | number]>; // false

// 99999
type IsUnknown<T> = (
    [T] extends [void]
        ? false // 排除any/void/never 仅 [never | void | any] extends [void] 能进入true 分支
        : void extends T
        ? true
        : false
) extends true // void extends void | unknown ==> true 分支，这里排除非 unknown 的类型
    ? true
    : false;

// 99991
type IsAny<T> = (any extends T ? true : false) extends true
    ? IsUnknown<T> extends true
        ? false
        : true
    : false;

type AAt = IsUnknown<{ [key: string]: any }>;
type AAt1 = IsUnknown<undefined>;
type AAt2 = IsUnknown<null>;
type AAt3 = IsUnknown<number>;
type AAt4 = IsUnknown<string>;
type AAt5 = IsUnknown<boolean>;
type AAt6 = IsUnknown<true>;
type AAt7 = IsUnknown<symbol>;
type AAt8 = IsUnknown<string[]>;
type AAt9 = IsUnknown<any>;
type AAt10 = IsUnknown<void>;
type AAt11 = IsUnknown<never>;
type AAt12 = IsUnknown<unknown>;
