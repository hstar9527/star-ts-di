import { DependencyIdentifier } from "./dependencyIdentifier";
import { Ctor, DependencyItem } from "./dependencyItem";
import { IDisposable, isDisposable } from "./dispose";

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

    get<T>(
        id: DependencyIdentifier<T>,
    ): DependencyItem<T> | null {
        return this.dependencyMap.get(id)!;
    }

    dispose(): void {
        throw new Error("Method not implemented.");
    }

}

export class ResolvedDependencyCollection implements IDisposable {

    private readonly resolvedDependencies = new Map<
        DependencyIdentifier<any>,
        any
    >();

    add<T>(id: DependencyIdentifier<T>, val: T | null): void {
        this.resolvedDependencies.set(id, val);
    }

    has<T>(id: DependencyIdentifier<T>): boolean {
        return this.resolvedDependencies.has(id);
    }

    get<T>(
        id: DependencyIdentifier<T>,
    ): T | null {
        return this.resolvedDependencies.get(id);
    }

    dispose(): void {
        Array.from(this.resolvedDependencies.values()).forEach((items) => {
            items.forEach((item: any) => isDisposable(item) ? item.dispose() : void 0);
        });

        this.resolvedDependencies.clear();
    }

}