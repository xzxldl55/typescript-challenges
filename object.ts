/**
 * 对象操作
 * 
 * 527. Append to object：为对象类型添加一个新字段
 * 599. Merge：合并两个对象，第二个类型会覆盖第一个的同键值
 * 645. Diff： 获取两个接口类型中的差值属性。
 * 1130. ReplaceKeys：在类型中替换联合类型的key，如果存在则按要求替换，否则设置该键值为never
 * 1367. RemoveIndexSignature：移除类型中的 indexSignature 属性（可转化为字符串键值的）
 */

// 527 属性键进行联合
type AppendToObject<O extends Record<string | symbol, any>, K extends string | symbol, V extends any> = {
    [P in keyof O | K]: P extends K ? V : O[P]
}
// Or: 交叉类型 { [P in K]: V } & Omit<O, K> 需要将O中的K摘出去，以便后来者覆盖（否则由于对同一个字段不同类型交叉，只能得到never）

type testAppendObj = AppendToObject<{ id: '1' }, 'value', 4> // expected to be { id: '1', value: 4 }

// 599 Merge
type Merge<T extends object, U extends object> = {
    [K in keyof T | keyof U]: K extends keyof U ? U[K] : (K extends keyof T ? T[K] : never)
};

type foo = {
    name: string;
    age: string;
};
type coo = {
    age: number;
    sex: string
};
type testMerge = Merge<foo, coo>; // expected to be {name: string, age: number, sex: string}

// 645
type Diff<T, U> = {
    [P in MyExclude<keyof T, keyof U>]: T[P] // 分别用Exclude来从T中排除U的key，再从U中排除T的key，再取交集即可
} & {
        [P in Exclude<keyof U, keyof T>]: U[P]
    };

// 另一种方法：使用交叉类型来排除共同的重复key（Exclude<keyof (T & U), keyof (T | U)>）
// type Diff<T, U> = { [P in Exclude<keyof (T & U), keyof (T | U)>]: (T & U)[K] };

type Foo = {
    a: string;
    b: number;
}
type Bar = {
    a: string;
    c: boolean
}
type diffRes1 = Diff<Foo, Bar> // { b: number, c: boolean }
type diffRes2 = Diff<Bar, Foo> // { b: number, c: boolean }
const diff1: diffRes1 = {
    b: 1,
    c: false
};
const diff2: diffRes2 = {
    b: 1,
    c: false
};

// 1130
type ReplaceKeys<T, K, D> = {
    [P in keyof T]: P extends K ? // 如果为待替换 key，进入下一阶段
    (P extends keyof D ? D[P] : never) : // 检查替换内容中是否存在该 Key，存在则替换，否则为never
    T[P] // 非待替换 key，直接返回
};

type NodeA = {
    type: 'A'
    name: string
    flag: number
}
type NodeB = {
    type: 'B'
    id: number
    flag: number
}
type NodeC = {
    type: 'C'
    name: string
    flag: number
}
type Nodes = NodeA | NodeB | NodeC
type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', { name: number, flag: string }> // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.
type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', { aa: number }> // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never

// 1367
type RemoveIndexSignature<T> = {
    [P in keyof T as P extends `${infer S}` ? P : never]: T[P]
};

type aRISType = {
    [key: string]: any;
    foo(): void;
}

type testRemoveIndexSignature = RemoveIndexSignature<aRISType>  // expected { foo(): void }
