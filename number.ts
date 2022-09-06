/**
 * 数字相关
 * 
 * 529. Absolute：接收string，number，bigint类型，返回绝对值
 * 531. String to Union：字符串转换为单字符的联合类型
 */

// 529
type Absolute<N extends string | number | bigint> = `${N}` extends `${infer S}${infer R}` ?
    `${ S extends '-' ? '' : S }${R}` :
    '';

type testAbsolute = Absolute<-1515>;

// 531
type StringToUnion<S extends string> = S extends `${infer F}${infer R}` ? // 字面量 + infer定义，递归
    [F, ...StringToUnion<R>] :
    [];
type testStringToUnion = StringToUnion<'123'>; // expected to be "1" | "2" | "3"