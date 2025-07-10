import { Container } from "./Container";
import { ServiceLocator } from "./ServiceLocator";
import {
  HTTP_CLIENT,
  API_BASE_URL,
  CUSTOMER_REPOSITORY,
  BRANCH_REPOSITORY,
  GET_CUSTOMER_BY_ID_USE_CASE,
  GET_CUSTOMER_BY_PHONE_USE_CASE,
  CREATE_CUSTOMER_USE_CASE,
  UPDATE_CUSTOMER_USE_CASE,
  GET_BRANCH_BY_ID_USE_CASE,
} from "./ServiceIdentifiers";

import { HttpClient, IHttpClient } from "../httpClient";
import {
  CustomerRepositoryImpl,
  createCustomerRepository,
} from "@/lib/data/repositories/customerRepository";
import {
  BranchRepositoryImpl,
  createBranchRepository,
} from "@/lib/data/repositories/branchRepository";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";
import { BranchRepository } from "@/lib/domain/repositories/iBranchRepository";
import {
  GetCustomerByIdUseCase,
  GetCustomerByPhoneNumberUseCase,
  CreateCustomerUseCase,
  UpdateCustomerUseCase,
  GetBranchByIdUseCase,
} from "@/lib/domain/usecases";

export class ServiceRegistry {
  /**
   * Register all services in the container
   */
  static registerServices(container: Container): Container {
    // Register core services
    container
      .registerInstance(
        API_BASE_URL,
        process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
      )
      .registerSingleton(HTTP_CLIENT, () => HttpClient.createWithEnv());

    // Register repositories
    container.registerSingleton(CUSTOMER_REPOSITORY, async () => {
      const httpClient = await container.resolve<IHttpClient>(HTTP_CLIENT);
      // Don't pass baseUrl since HttpClient already has it configured
      return createCustomerRepository(httpClient);
    });

    container.registerSingleton(BRANCH_REPOSITORY, async () => {
      const httpClient = await container.resolve<IHttpClient>(HTTP_CLIENT);
      // Don't pass baseUrl since HttpClient already has it configured
      return createBranchRepository(httpClient);
    });

    // Register use cases
    container.registerSingleton(GET_CUSTOMER_BY_ID_USE_CASE, async () => {
      const customerRepository = await container.resolve<CustomerRepository>(
        CUSTOMER_REPOSITORY
      );
      return new GetCustomerByIdUseCase(customerRepository);
    });

    container.registerSingleton(GET_CUSTOMER_BY_PHONE_USE_CASE, async () => {
      const customerRepository = await container.resolve<CustomerRepository>(
        CUSTOMER_REPOSITORY
      );
      return new GetCustomerByPhoneNumberUseCase(customerRepository);
    });

    container.registerSingleton(CREATE_CUSTOMER_USE_CASE, async () => {
      const customerRepository = await container.resolve<CustomerRepository>(
        CUSTOMER_REPOSITORY
      );
      return new CreateCustomerUseCase(customerRepository);
    });

    container.registerSingleton(UPDATE_CUSTOMER_USE_CASE, async () => {
      const customerRepository = await container.resolve<CustomerRepository>(
        CUSTOMER_REPOSITORY
      );
      return new UpdateCustomerUseCase(customerRepository);
    });

    container.registerSingleton(GET_BRANCH_BY_ID_USE_CASE, async () => {
      const branchRepository = await container.resolve<BranchRepository>(
        BRANCH_REPOSITORY
      );
      return new GetBranchByIdUseCase(branchRepository);
    });

    return container;
  }

  /**
   * Initialize the global service locator with all services
   */
  static initialize(): void {
    const serviceLocator = ServiceLocator.getInstance();
    const container = serviceLocator.getContainer();
    this.registerServices(container);
  }

  /**
   * Get a service from the global service locator
   */
  static async getService<T>(identifier: any): Promise<T> {
    const serviceLocator = ServiceLocator.getInstance();
    return serviceLocator.resolve<T>(identifier);
  }

  /**
   * Check if a service is registered in the global service locator
   */
  static isServiceRegistered<T>(identifier: any): boolean {
    const serviceLocator = ServiceLocator.getInstance();
    return serviceLocator.isRegistered<T>(identifier);
  }
}
