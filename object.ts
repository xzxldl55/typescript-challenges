/**
 * 对象操作
 *
 * 527. Append to object：为对象类型添加一个新字段
 * 599. Merge：合并两个对象，第二个类型会覆盖第一个的同键值
 * 645. Diff： 获取两个接口类型中的差值属性。
 * 1130. ReplaceKeys: 在类型中替换联合类型的key，如果存在则按要求替换，否则设置该键值为never
 * 1367. RemoveIndexSignature: 移除类型中的 indexSignature 属性（可转化为字符串键值的）
 * 2595. PickByType: 从类型T中，提取符合U类型的字段出来
 * 2757. PartialByKeys: 实现一个通用的PartialByKeys<T, K>，它接收两个类型参数T和K, K指定应设置为可选的T的属性集。当没有提供K时，它就和普通的Partial<T>一样使所有属性都是可选的。
 * 2759. RequiredByKeys: 实现一个通用的RequiredByKeys<T, K>，它接收两个类型参数T和K, K指定应设为必选的T的属性集。当没有提供K时，它就和普通的Required<T>一样使所有的属性成为必选的。
 * 2793. Mutable: 实现一个通用的类型 Mutable<T>，使类型 T 的全部属性可变（非只读）。
 * 2852. OmitByType: 从类型T中，排除符合U类型的字段 与 PickByType 相反
 * 2946. ObjectEntries: 实现类似 Object.entries 的方法 {a: '1', b: '2'} --> ['a', '1'] | ['b', '2']
 * 3376. InorderTraversal: 中序遍历二叉树
 * 4179. Flip: 转换 key - value
 */

// 527 属性键进行联合
type AppendToObject<
  O extends Record<string | symbol, any>,
  K extends string | symbol,
  V extends any
> = {
  [P in keyof O | K]: P extends K ? V : O[P];
};
// Or: 交叉类型 { [P in K]: V } & Omit<O, K> 需要将O中的K摘出去，以便后来者覆盖（否则由于对同一个字段不同类型交叉，只能得到never）

type testAppendObj = AppendToObject<{ id: '1' }, 'value', 4>; // expected to be { id: '1', value: 4 }

// 599 Merge
type Merge<T extends object, U extends object> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never;
};

type foo = {
  name: string;
  age: string;
};
type coo = {
  age: number;
  sex: string;
};
type testMerge = Merge<foo, coo>; // expected to be {name: string, age: number, sex: string}

// 645
type Diff<T, U> = {
  [P in Exclude<keyof T, keyof U>]: T[P]; // 分别用Exclude来从T中排除U的key，再从U中排除T的key，再取交集即可
} & {
  [P in Exclude<keyof U, keyof T>]: U[P];
};

// 另一种方法：使用交叉类型来排除共同的重复key（Exclude<keyof (T & U), keyof (T | U)>）
// type Diff<T, U> = { [P in Exclude<keyof (T & U), keyof (T | U)>]: (T & U)[K] };

type Foo = {
  a: string;
  b: number;
};
type Bar = {
  a: string;
  c: boolean;
};
type diffRes1 = Diff<Foo, Bar>; // { b: number, c: boolean }
type diffRes2 = Diff<Bar, Foo>; // { b: number, c: boolean }
const diff1: diffRes1 = {
  b: 1,
  c: false,
};
const diff2: diffRes2 = {
  b: 1,
  c: false,
};

// 1130
type ReplaceKeys<T, K, D> = {
  [P in keyof T]: P extends K // 如果为待替换 key，进入下一阶段
    ? P extends keyof D
      ? D[P]
      : never // 检查替换内容中是否存在该 Key，存在则替换，否则为never
    : T[P]; // 非待替换 key，直接返回
};

type NodeA = {
  type: 'A';
  name: string;
  flag: number;
};
type NodeB = {
  type: 'B';
  id: number;
  flag: number;
};
type NodeC = {
  type: 'C';
  name: string;
  flag: number;
};
type Nodes = NodeA | NodeB | NodeC;
type ReplacedNodes = ReplaceKeys<
  Nodes,
  'name' | 'flag',
  { name: number; flag: string }
>; // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.
type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', { aa: number }>; // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never

// 1367
type RemoveIndexSignature<T> = {
  [P in keyof T as P extends `${infer S}` ? P : never]: T[P];
};

type aRISType = {
  [key: string]: any;
  foo(): void;
};

type testRemoveIndexSignature = RemoveIndexSignature<aRISType>; // expected { foo(): void }

// 2595
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type testPickByType = PickByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;

// 2852
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type testOmitByType = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>;

// 2757
type PartialByKeys<T, K = ''> = K extends ''
  ? {
      [P in keyof T]?: T[P];
    }
  : {
      [P in keyof T as P extends K ? P : never]?: T[P];
    } & {
      [O in keyof T as O extends K ? never : O]: T[O];
    };

type testPartialByKeys = PartialByKeys<NodeA, 'type'>;
type testPartialByKeys2 = PartialByKeys<NodeA>;

// 2759
type RequiredByKeys<T, K = ''> = K extends ''
  ? {
      [P in keyof T]-?: T[P]; // 未传递K则全必选
    }
  : {
      [P in keyof T as P extends K ? P : never]-?: T[P]; // -? 必选
    } & {
      [P in keyof T as P extends K ? never : P]: T[P]; // 不在K中的键则不管
    };

type testRequiredByKeys = RequiredByKeys<testPartialByKeys2, 'type'>;
type testRequiredByKeys2 = RequiredByKeys<testPartialByKeys2>;

// 2793
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface Todo {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}

type MutableTodo = Mutable<Todo>; // { title: string; description: string; completed: boolean; }

// 2946
// 1. -? 去除可选参数带来的 undefined类型联合
// 2. T[P] extends infer R | undefined ? R : T[P]，去除可选参数内部自动诞生的 undefined类型
type ObjectEntries<T> = {
  [P in keyof T]-?: [P, T[P] extends infer R | undefined ? R : T[P]];
}[keyof T];

type testObjectEntries = ObjectEntries<{
  name: string;
  age: number;
  locations?: string[] | null;
}>;

// 3376
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

type InorderTraversal<T extends TreeNode | null> = [T] extends [TreeNode] // 使用 [T] 嵌套泛型，避免进行 分布式条件类型判断（distributive conditional type）
  ? [...InorderTraversal<T['left']>, T['val'], ...InorderTraversal<T['right']>]
  : [];

type testInorderTraversal = InorderTraversal<{
  val: 1;
  left: {
    val: 2;
    left: null;
    right: {
      val: 3;
      left: null;
      right: null;
    };
  };
  right: {
    val: 4;
    left: null;
    right: null;
  };
}>;

// 4179
type Flip<T extends Record<string, any>> = {
  [K in keyof T as T[K] | `${T[K]}`]: K;
};

type testFlip = Flip<{
  a: 'x';
  b: 1;
  c: false;
}>;
