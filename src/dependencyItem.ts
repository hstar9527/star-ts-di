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

export interface DependencyItem<T> {

    useClass: Ctor<T>;

}