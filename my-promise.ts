/**
 * Promise 遵循原则：
 *
 * 1. Promise对象代表着一个异步操作，它必然处于以下三种状态：
 *      - pending 等待
 *      - fulfilled 已完成 --> 执行 resolve()
 *      - rejected 已拒绝 --> 执行reject() / 抛出错误
 *    当Promise处于 fulfilled / rejected 后，将无法变更状态
 *
 * 2. Promise状态运转流程: 当 promise 被调用后，它会以处理中状态 (pending) 开始, 最终会以被解决状态 (fulfilled) 或 被拒绝状态 (rejected) 结束，并在完成时调用相应的回调函数（传给 then 和 catch）。
 *
 * 3. Promise.then回调执行时机: 在本轮 事件循环 运行完成之前，Promise.then 的回调函数是不会被调用的 --> PS: 需要注意的是 Promise 本身内部接受的函数参数 (resolve: Promise.resolve, reject: Promise.reject) => void; 是同步进行的
 *
 * 4. thenable对象: 指的是具有then方法的对象，Promise的一些静态方法会自动像解析Promise一样对其进行解析运行
 *
 * 5. Promise.resolve(T): 将会返回一个 Promise 对象，其中 参数 T 有以下几种情况
 *      1) T = Promise实例: 则原封不动返回这个 Promise 实例
 *      2）T = thenable对象: Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法
 *      3) T = 不是具有then方法的对象，或根本就不是对象(基础数据类型 + 没有then方法的对象): 返回一个新的 Promise 对象，状态为resolved，将参数 T 传递到下一个then
 *      4) T = 空，不传参数: 直接返回一个resolved状态的 Promise 对象
 *
 * 6. Promise.reject(T): 将返回一个新的 Promise 实例，该实例的状态为rejected
 *      1) 其中参数T，将会原封不动的作为 reject 理由返回，这一点与Promise.resolve不同 ==>
 *          eg: Promise.reject({ then: (resolve, reject) => reject(123) })
 *                  .catch(rejectReason => console.log(rejectReason)); // { then: (resolve, reject) => reject(123) } 而不是 123
 *
 * 7. Promise.prototype.then(T): 它的作用是为 Promise 实例添加状态改变时的回调函数
 *      1) then方法的第一个参数是resolved状态的回调函数。如果该参数不是函数，则会在内部被替换为 (x) => x，即原样返回 promise 最终结果的函数；
 *      2) 第二个参数（可选）是rejected状态的回调函数。如果该参数不是函数，则会在内部被替换为一个 "Thrower" 函数 (it throws an error it received as argument)。
 *      3) then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
 *        - 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)
 *        - 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
 *        - 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
 *        - 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
 *
 * 8. Promise.prototype.catch(): catch() 方法返回一个Promise，并且处理拒绝的情况。
 *      1) 它的行为与调用Promise.prototype.then(undefined, onRejected) 相同，可以将其视作这种形式的语法糖
 *      2) 如果 Promise 状态已经变成resolved，再抛出错误是无效的。`new Promise((s, j) => { s(123); j(456) })` ==> j(456) 是无效的，不会被错误捕获
 *      3) Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。所以通常，一串Promise链条只需要在最末尾有一个 catch 处理错误即可。
 *      4) 当一个Promise链，没有错误处理时，将会将错误抛出到顶层 `Unhandled Promise Rejection Warning.`
 *
 * 9. 链式调用: Promise.prototype.then/catch 始终会返回一个新的Promise实例对象，这使得我们可以链式调用（一定程度缓解了原来异步回调地狱的问题） Promise.resolve().then(...).then(...).then(...)...
 *
 * 10. Promise.prototype.finally(): 与 try/catch/finally 中的 finally 一个道理，finally 无论结果是 fulfilled 还是 rejected 都会被执行。
 *      1) 由于无法知道promise的最终状态，所以finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。
 *
 * 11. Promise.all(PromiseInstance[]): 并发Promise函数
 *      1) 同时并发多个Promise，并在所有的Promise实例都 fulfilled 后，调用其thenable
 *      2) 当某个并发的Promise，状态为 reject 时，将终止 Promise.all，并将控制权转交后续的 catch 处理
 *      3) 后续 thenable 接收参数为 Promise.all() 中每个 Promise 结果的数组，按照原顺序排序
 *
 * 12. Promise.race(PromiseInstance[]): 竞态Promise函数
 *      1) 同时竞态执行多个Promise，只要其中一个 Promise 状态变为完成(fulfilled / rejected)，将结束运行
 *      2) 一般用作异步操作超时处理
 *
 * 13. Promise.allSettled(): 并发Promise，但与Promise.all不同的是，rejected状态也不会直接结束
 *      1) 同时并发多个Promise，并在所有的Promise实例都 fulfilled 或 rejected 后，调用其thenable
 *      2) 与Promise.all不同的是，其返回值，将被固定数据结构包装一层 `{ status: 'fulfilled' | 'rejected'; value?: any; reason?: any }[]` fulfilled 状态 value 有值，rejected 下 reason 有值。
 */

enum PromiseStatus {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

function nextTick(callback: (...args: any[]) => any) {
  return () => setTimeout(() => callback());
}

class MyPromise<T> {
  PromiseResult: T = undefined as unknown as T;
  PromiseState: PromiseStatus;
  onFulfilledCallbacks: (((value: any) => any) | undefined | null)[] = []; // 成功回调保存: then执行时为pending状态，先将回调保存，等待resolve执行后再取出执行 | 用数组缓存，也同时实现了一个Promise能被多次then
  onRejectedCallbacks: (((reason: any) => any) | undefined | null)[] = []; // 失败回调保存: ~

  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    // 1. 初始化状态pending
    this.PromiseState = PromiseStatus.PENDING;
    // 2. then回调保存
    // 3. 执行Promise回调（PS:这里用bind绑定实例的this环境，因为二者要作为参数传递到外部【executor】函数作用域环境中调用，会丢失class实例的this）
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      // executor执行抛出的错误，自动当作reject处理
      this.reject(err);
    }
  }

  resolve(value: T) {
    // resolve后，将pending状态改为fulfilled（PS:这里存在判断而非直接修改，遵循上面原则 1. 当状态非 pending 后，将无法在修改状态）
    if (this.PromiseState === PromiseStatus.PENDING) {
      this.PromiseState = PromiseStatus.FULFILLED;
      this.PromiseResult = value;
      this.onFulfilledCallbacks.forEach((fn) => fn && fn(value));
    }
  }

  reject(reason?: any) {
    if (this.PromiseState === PromiseStatus.PENDING) {
      this.PromiseState = PromiseStatus.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach((fn) => fn && fn(reason));
    }
  }

  then<TResult = T, TReason = never>(
    onFulfilled?: ((value: T) => TResult) | undefined | null,
    onRejected?: ((reason: any) => TReason) | undefined | null
  ): MyPromise<TResult | TReason> {
    // 根据第7条原则，我们需要对非函数的onFulfilled/onRejected进行默认值填补
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value: T) => value as unknown as TResult; // 直接返回上一步链条Promise执行后结果
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason: any) => {
            // 未定义情况，直接抛出 reason（如存在）
            throw reason;
          };
    if (this.PromiseState === PromiseStatus.PENDING) {
      this.onFulfilledCallbacks.push(nextTick(onFulfilled?.bind(this)));
      this.onRejectedCallbacks.push(nextTick(onRejected?.bind(this)));
    } else if (this.PromiseState === PromiseStatus.FULFILLED) {
      return MyPromise.resolve<TResult>(
        onFulfilled(this.PromiseResult as T) as TResult
      );
    } else {
      let err: TReason;
      try {
        err = onRejected(this.PromiseResult as any) as TReason;
      } catch (e) {
        err = e as TReason;
      }
      return MyPromise.reject<TReason>(err);
    }
  }

  catch<TReason = never>(
    onRejected?: ((reason: any) => TReason) | undefined | null
  ): MyPromise<TReason> {
    return this.then<never, TReason>(undefined, onRejected);
  }

  static resolve<TResult>(value: TResult): MyPromise<TResult> {
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject<TReason>(reason: TReason): MyPromise<TReason> {
    return new MyPromise((_resolve, reject) => {
      reject(reason);
    });
  }

  static all() {}

  static race() {}

  static allSettled() {}
}

const testPromise = new MyPromise<string>((resolve, reject) => {
  resolve("1");
});
