/**
 * 字符串相关
 * 
 * 106. TrimLeft：实现 TrimLeft<T> ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。
 * 108. Trim：实现Trim<T>，它是一个字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。
 * 110. Capitalize：实现 Capitalize<T> 它将字符串的第一个字母转换为大写，其余字母保持原样。
 * 116. Replace：实现 Replace<S, From, To> 将字符串 S 中的第一个子字符串 From 替换为 To 。
 * 119. ReplaceAll：实现 ReplaceAll<S, From, To> 将一个字符串 S 中的所有子字符串 From 替换为 To。
 * xxx. ConverStrToArray：字符串转数组
 * 298. Length of String：计算字符串长度
 * 612. KebabCase：驼峰换短杠 FooBarBaz -> foo-bar-baz
 * 1978. Percentage Parser：百分比解析器，根据规则 /^(\+|\-)?(\d*)?(\%)?$/ 来匹配类型T，得到结果类型 [sign, number, unit]
 */

// 106
type Blank = ' ' | '\n' | '\t';
type TrimLeft<T extends string> = T extends `${Blank}${infer R}` ? TrimLeft<R> : T;  // 1. 用模板字符串模拟继承类型；2. 递归一个个去除空白字符。

type trimedLeft = TrimLeft<'     Hello World  '> // 应推导出 'Hello World  '

// 108
type Trim<T extends string> = T extends `${infer R}${Blank}` ? // 先消消乐右边
    Trim<R> :
    TrimLeft<T>; // 在消消乐左边

type trimed = Trim<'     Hello World    '>

// 110
type MyCapitalize<T extends string> = T extends `${infer C}${infer R}` ? `${Uppercase<C>}${R}` : T; // 使用内建类型 Uppercase 将首字母大写

type capitalized = MyCapitalize<'hello world'> // expected to be 'Hello world'

// 116
type Replace<S extends string, F extends string, T extends string> = F extends '' ? // From为空时，返回原字符串
    S :
    (
        S extends `${infer X}${F}${infer R}` ? // 否则利用infer定义变量替换掉From
        `${X}${T}${R}` :
        S
    ) ;

type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'

// 119
type ReplaceAll<S extends string, F extends string, T extends string> = F extends '' ?
    S :
    (
        S extends `${infer X}${F}${infer R}` ? // 与Replace逻辑一致
        `${ReplaceAll<X, F, T>}${T}${ReplaceAll<R, F, T>}` : // 这里需要对前后拼接字符 递归 替换，以达成replaceAll的效果
        S
    );

type replacedAll = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'

// xxx
type ConverStrToArray<S extends string> = S extends `${infer F}${infer O}` ?
        [F, ...ConverStrToArray<O>] :
        [];

// 298
type StringLen<S extends string> = ConverStrToArray<S>['length']

type TestStringLen = StringLen<'1234'>;

// 612
type KebabCase<S extends string> = S extends `${infer F}${infer R}` ?
    R extends Uncapitalize<R> ?
        `${Lowercase<F>}${KebabCase<R>}` :
        `${F}-${KebabCase<R>}` :
    S;

type testKebabCase = KebabCase<'OnClickBody'>; // on-click-body

// 1978 --> 分而治之，拆分成要求的三份进行匹配
type PercentageParser<T extends string> = [
    GetFirstChar<T>,
    GetMiddleStr<T>,
    GetLastChar<T>
]
type GetFirstChar<T extends string> = T extends `${infer F}${string}`
    ? F extends '+' | '-' ? F : ''
    : '';
type GetLastChar<T extends string> = T extends `${string}%` ? '%' : '';
type GetMiddleStr<T extends string> = T extends `${GetFirstChar<T>}${infer M}${GetLastChar<T>}` ? M : '';

type testPercentageParser = PercentageParser<'-98%'>