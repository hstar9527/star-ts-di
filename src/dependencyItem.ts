/**
 * 表示一个构造函数类型
 *
 * @export
 * @interface Ctor
 * @template T
 */
export interface Ctor<T> {
    new(...args: any[]): T;

    name: string;
}

/**
 *const injector = new Injector([[ILogger, { useClass: ConsoleLogger }], [MyService]]);
 *
 * @export
 * @interface DependencyItem
 * @template T
 */
export interface DependencyItem<T> {

    useClass: Ctor<T>;

}
