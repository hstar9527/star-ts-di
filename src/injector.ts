import { getDependencies } from "./decorators";
import { Dependency, DependencyCollection, ResolvedDependencyCollection } from "./dependencyCollection";
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
        this.dependencyCollection = new DependencyCollection(dependencies || []);
        this.resolvedDependencyCollection = new ResolvedDependencyCollection();
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
        const thing = this.createDependency(id);
        this.resolvedDependencyCollection.add(id, thing);
        return thing;
    }
    private _getValue<T>(id: DependencyIdentifier<T>): T | null | typeof NotInstantiatedSymbol {
        if (this.resolvedDependencyCollection.has(id)) {
            return this.resolvedDependencyCollection.get(id);
        }
        return NotInstantiatedSymbol;
    }

    private createDependency<T>(id: DependencyIdentifier<T>): T | null {
        const registrations = this.dependencyCollection.get(id)!;
        const Ctor = registrations.useClass;
        //查找构造器需要被注入的依赖
        const declaredDependencies = getDependencies(Ctor)
            .sort((a, b) => a.paramIndex - b.paramIndex);
        //存储构造器所需参数
        const resolvedArgs: any[] = [];
        for (const dep of declaredDependencies) {
            const thing = this._get(dep.identifier as any)
            resolvedArgs.push(thing);
        }
        return new Ctor(...resolvedArgs);
    }

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