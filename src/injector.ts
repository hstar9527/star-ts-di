import { Dependency } from "./dependencyCollection";
import { DependencyIdentifier } from "./dependencyIdentifier";
import { IDisposable } from "./dispose";
import { StarDiError } from "./error";

const NotInstantiatedSymbol = Symbol('$$NOT_INSTANTIATED_SYMBOL');

export class Injector implements IDisposable {

    /**
     * 存储注册的服务
     *
     * @private
     * @type {DependencyCollection}
     * @memberof Injector
     */
    private readonly dependencyCollection: DependencyCollection;

    /**
     * 存储服务的实例
     *
     * @private
     * @type {ResolvedDependencyCollection}
     * @memberof Injector
     */
    private readonly resolvedDependencyCollection: ResolvedDependencyCollection;

    private disposed = false;

    constructor(
        dependencies?: Dependency[],
    ) {
        console.log(dependencies)
    }

    get<T>(id: DependencyIdentifier<T>): T | null {
        this._ensureInjectorNotDisposed();
        const newResult = this._get(id);
        return newResult;
    }

    private _get<T>(id: DependencyIdentifier<T>): T | null {
        const cachedResult = this._getValue(id);
        if (cachedResult !== NotInstantiatedSymbol) {
            return cachedResult;
        }
    }

    private _getValue<T>(id: DependencyIdentifier<T>): T | null {
        // if (
        //     this.dependencyCollection.has(id) &&
        //     !this.resolvedDependencyCollection.has(id)
        // ) {
        //     return NotInstantiatedSymbol;
        // }

        // return this.resolvedDependencyCollection.get(id, quantity);
        // const cachedResult = this.getValue(id);
        // if (cachedResult !== NotInstantiatedSymbol) {
        //     return cachedResult;
        // }
        // return this.createDependency(id);
        return null;
    }

    // see if the dependency can be instantiated by itself or its parent
    // const shouldCache = !withNew;
    // return this.createDependency(id, quantity, lookUp, shouldCache) as
    // | T[]
    // | T
    // | AsyncHook<T>
    // | null;


    dispose(): void {
        throw new Error("Method not implemented.");
    }

    private _ensureInjectorNotDisposed(): void {
        if (this.disposed) {
            throw new InjectorAlreadyDisposedError();
        }

    }



}

class InjectorAlreadyDisposedError extends StarDiError {
    constructor() {
        super('Injector cannot be accessed after it was disposed.');
    }
}