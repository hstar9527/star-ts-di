import { DependencyIdentifier } from "./dependencyIdentifier";
import { Ctor, DependencyItem } from "./dependencyItem";
import { IDisposable } from "./dispose";

export type DependencyClass<T> = [Ctor<T>];

export type DependencyPair<T> = [DependencyIdentifier<T>, DependencyItem<T>];

export type Dependency<T = any> = DependencyPair<T> | DependencyClass<T>

export class DependencyCollection implements IDisposable {

    private readonly dependencyMap = new Map<
        DependencyIdentifier<any>,
        DependencyItem<any>
    >();

    constructor(dependencies: Dependency[]) {
        dependencies.forEach((dependency) => {
            this.add(dependency[0], dependency[1]);
        })
    }

    public add<T>(
        ctorOrId: Ctor<T> | DependencyIdentifier<T>,
        val?: DependencyItem<T>,
    ): void {
        if (typeof val === 'undefined') {
            val = { useClass: ctorOrId as Ctor<T> };
        }
        this.dependencyMap.set(ctorOrId, val);
    }

    dispose(): void {
        throw new Error("Method not implemented.");
    }

}