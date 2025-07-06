import { Container } from "./Container";

export class ServiceLocator {
  private static instance: ServiceLocator;
  private container: Container;

  private constructor() {
    this.container = new Container();
  }

  /**
   * Get the singleton instance of ServiceLocator
   */
  static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  /**
   * Get the container instance
   */
  getContainer(): Container {
    return this.container;
  }

  /**
   * Set a custom container (useful for testing)
   */
  setContainer(container: Container): void {
    this.container = container;
  }

  /**
   * Resolve a service using the container
   */
  async resolve<T>(identifier: any): Promise<T> {
    return this.container.resolve<T>(identifier);
  }

  /**
   * Check if a service is registered
   */
  isRegistered<T>(identifier: any): boolean {
    return this.container.isRegistered<T>(identifier);
  }
}
