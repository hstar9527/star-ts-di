import { DependencyIdentifier } from "./dependencyIdentifier";
import { Ctor } from "./dependencyItem";

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