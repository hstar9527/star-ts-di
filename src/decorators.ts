import { DependencyIdentifier, IdentifierDecorator } from "./dependencyIdentifier";
import { Ctor } from "./dependencyItem";
import { IdentifierDecoratorSymbol } from './dependencyIdentifier';

export const TARGET = Symbol('$$TARGET');
export const DEPENDENCIES = Symbol('$$DEPENDENCIES');

export interface DependencyDescriptor<T> {
    paramIndex: number;
    identifier: DependencyIdentifier<T>;
}

export function getDependencies<T>(
    registerTarget: Ctor<T>,
): DependencyDescriptor<any>[] {
    const target = registerTarget as any;
    return target[DEPENDENCIES] || [];
}

function setDependency<T>(registerTarget: Ctor<T>, identifier: IdentifierDecorator<T>, paramIndex: number) {
    const descriptor: DependencyDescriptor<T> = {
        paramIndex,
        identifier,
    };

    const target = registerTarget as any;
    if (target[TARGET] === target) {
        target[DEPENDENCIES].push(descriptor);
    } else {
        target[DEPENDENCIES] = [descriptor];
        target[TARGET] = target;
    }
}

const knownIdentifiers = new Set<string>();

const cachedIdentifiers = new Map<string, IdentifierDecorator<any>>();

export function createIdentifier<T>(id: string): IdentifierDecorator<T> {
    if (knownIdentifiers.has(id)) {
        console.error(
            `Identifier "${id}" already exists. Returning the cached identifier decorator.`,
        );
        return cachedIdentifiers.get(id)!;
    }

    const decorator = (<any>(
        function (registerTarget: Ctor<T>, _key: string, index: number): void {
            setDependency(registerTarget, decorator, index);
        }
    )) as IdentifierDecorator<T>;

    decorator.decoratorName = id;
    decorator.toString = () => decorator.decoratorName;
    decorator[IdentifierDecoratorSymbol] = true;

    knownIdentifiers.add(id);
    cachedIdentifiers.set(id, decorator);

    return decorator;
}



