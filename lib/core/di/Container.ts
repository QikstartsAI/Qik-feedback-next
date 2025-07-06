export type ServiceIdentifier<T = any> =
  | string
  | symbol
  | (new (...args: any[]) => T);

export interface ServiceDescriptor<T = any> {
  identifier: ServiceIdentifier<T>;
  factory: () => T | Promise<T>;
  singleton: boolean;
  instance?: T;
}

export class Container {
  private services = new Map<ServiceIdentifier, ServiceDescriptor>();

  /**
   * Register a singleton service
   */
  registerSingleton<T>(
    identifier: ServiceIdentifier<T>,
    factory: () => T | Promise<T>
  ): Container {
    this.services.set(identifier, {
      identifier,
      factory,
      singleton: true,
    });
    return this;
  }

  /**
   * Register a transient service (new instance each time)
   */
  registerTransient<T>(
    identifier: ServiceIdentifier<T>,
    factory: () => T | Promise<T>
  ): Container {
    this.services.set(identifier, {
      identifier,
      factory,
      singleton: false,
    });
    return this;
  }

  /**
   * Register an instance directly
   */
  registerInstance<T>(
    identifier: ServiceIdentifier<T>,
    instance: T
  ): Container {
    this.services.set(identifier, {
      identifier,
      factory: () => instance,
      singleton: true,
      instance,
    });
    return this;
  }

  /**
   * Resolve a service by identifier
   */
  async resolve<T>(identifier: ServiceIdentifier<T>): Promise<T> {
    const descriptor = this.services.get(identifier);

    if (!descriptor) {
      throw new Error(`Service not registered: ${String(identifier)}`);
    }

    // If singleton and already instantiated, return the instance
    if (descriptor.singleton && descriptor.instance !== undefined) {
      return descriptor.instance;
    }

    // Create new instance
    const instance = await descriptor.factory();

    // Store instance if singleton
    if (descriptor.singleton) {
      descriptor.instance = instance;
    }

    return instance;
  }

  /**
   * Check if a service is registered
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.services.has(identifier);
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Get all registered service identifiers
   */
  getRegisteredServices(): ServiceIdentifier[] {
    return Array.from(this.services.keys());
  }
}
