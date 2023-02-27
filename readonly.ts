/**
 * 7. 实现 Readonly 该 Readonly 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会被 readonly 所修饰。
 * 8. 实现一个通用MyReadonly2<T, K>，它带有两种类型的参数T和K,K指定应设置为Readonly的T的属性集。如果未提供K，则应使所有属性都变为只读，就像普通的Readonly<T>一样。
 * 9. 实现一个通用的DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。
 */
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

type MyReadonly2<T extends object, K extends keyof T = keyof T> = {
    readonly [P in K]: T[K];
} & {
    [U in keyof T as U extends K ? never : U]: T[U];
};

type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Function
        ? T[P]
        : T[P] extends object
        ? DeepReadonly<T[P]>
        : T[P];
};

interface Todo {
    title: string;
    description: string;
}
const todo: MyReadonly<Todo> = {
    title: 'Hey',
    description: 'foobar',
};
todo.title = 'Hello'; // Error: cannot reassign a readonly property
todo.description = 'barFoo'; // Error: cannot reassign a readonly property

const todo2: MyReadonly2<Todo, 'title'> = {
    title: 'Hey',
    description: 'foobar',
};
todo2.title = 'Hello'; // Error: cannot reassign a readonly property
todo2.description = 'barFoo'; // √ can update

type X = {
    x: {
        a: 1;
        b: 'hi';
    };
    y: 'hey';
};
type Expected = {
    readonly x: {
        readonly a: 1;
        readonly b: 'hi';
    };
    readonly y: 'hey';
};
type Todo3 = DeepReadonly<X>; // should be same as `Expected`
