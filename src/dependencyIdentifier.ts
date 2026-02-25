import { Ctor } from "./dependencyItem";

export const IdentifierDecoratorSymbol = Symbol('$$IDENTIFIER_DECORATOR');

export interface IdentifierDecorator<T> {
    [IdentifierDecoratorSymbol]: true;

    /** Call signature allowing use as a parameter decorator. */
    (...args: any[]): void;

    /** The name of this identifier, set when calling `createIdentifier`. */
    decoratorName: string;

    /** Returns the decorator name for debugging purposes. */
    toString: () => string;

    /** Phantom type property to preserve the type information. */
    type: T;
}

/**
 * // Class as identifier
 * class MyService {}
 * injector.get(MyService);
 * 
 * // IdentifierDecorator for interfaces
 * const ILogger = createIdentifier<ILogger>('ILogger');
 * injector.get(ILogger);
 */
export type DependencyIdentifier<T> = Ctor<T> | IdentifierDecorator<T>;