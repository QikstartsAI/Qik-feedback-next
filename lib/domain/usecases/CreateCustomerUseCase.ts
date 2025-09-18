import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface ICreateCustomerUseCase {
  execute(customerData: CustomerPayload): Promise<Customer>;
}

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Execute the use case to create a new customer
   * @param customerData - Customer data to create
   * @returns Promise<Customer>
   * @throws Error if validation fails or repository fails
   */
  async execute(customerData: CustomerPayload): Promise<Customer> {
    console.log("🎯 [CreateCustomerUseCase] execute - Starting", { 
      name: customerData.name,
      lastName: customerData.lastName,
      phoneNumber: customerData.phoneNumber ? 
        `${customerData.phoneNumber.substring(0, 4)}***` : 'N/A',
      email: customerData.email,
      branchesCount: customerData.branches?.length || 0
    });

    // Validate customer data
    console.log("🔍 [CreateCustomerUseCase] execute - Validating customer data");
    this.validateCustomerData(customerData);
    console.log("✅ [CreateCustomerUseCase] execute - Validation passed");

    try {
      console.log("📞 [CreateCustomerUseCase] execute - Calling repository");
      const result = await this.customerRepository.createCustomer(customerData);
      
      console.log("🎉 [CreateCustomerUseCase] execute - Success", { 
        customerId: result.id,
        customerName: result.payload?.name,
        createdAt: result.createdAt
      });
      
      return result;
    } catch (error: any) {
      console.error("❌ [CreateCustomerUseCase] execute - Error", { 
        customerData: {
          name: customerData.name,
          lastName: customerData.lastName,
          phoneNumber: customerData.phoneNumber ? 
            `${customerData.phoneNumber.substring(0, 4)}***` : 'N/A',
          email: customerData.email
        },
        error 
      });
      
      // Handle 409 Conflict - Customer already exists
      if (error?.status === 409 && error?.data?.message === "email registered") {
        console.log("🔄 [CreateCustomerUseCase] execute - Customer already exists, attempting to recover");
        
        // Try to recover the existing customer by phone number (more reliable)
        if (customerData.phoneNumber) {
          try {
            console.log("🔍 [CreateCustomerUseCase] execute - Searching for existing customer by phone");
            const existingCustomer = await this.customerRepository.getCustomerByPhoneNumber(customerData.phoneNumber);
            
            if (existingCustomer) {
              console.log("✅ [CreateCustomerUseCase] execute - Existing customer found by phone", { 
                customerId: existingCustomer.id,
                customerName: existingCustomer.payload?.name,
                customerType: "recurrent"
              });
              
              // Return the existing customer as a recurrent customer
              return existingCustomer;
            }
          } catch (recoveryError) {
            console.error("❌ [CreateCustomerUseCase] execute - Failed to recover customer by phone", { 
              phoneNumber: customerData.phoneNumber ? 
                `${customerData.phoneNumber.substring(0, 4)}***` : 'N/A',
              recoveryError 
            });
          }
        }
        
        // If phone search failed, try email search as fallback
        if (customerData.email) {
          try {
            console.log("🔍 [CreateCustomerUseCase] execute - Searching for existing customer by email (fallback)");
            const existingCustomer = await this.customerRepository.getCustomerByEmail(customerData.email);
            
            if (existingCustomer) {
              console.log("✅ [CreateCustomerUseCase] execute - Existing customer found by email", { 
                customerId: existingCustomer.id,
                customerName: existingCustomer.payload?.name,
                customerType: "recurrent"
              });
              
              // Return the existing customer as a recurrent customer
              return existingCustomer;
            }
          } catch (recoveryError) {
            console.error("❌ [CreateCustomerUseCase] execute - Failed to recover customer by email", { 
              email: customerData.email,
              recoveryError 
            });
          }
        }
        
        // If both searches failed, throw an error
        console.error("❌ [CreateCustomerUseCase] execute - Customer conflict but could not recover existing customer");
        throw new Error("Customer conflict detected but could not recover existing customer");
      }
      
      // Handle other errors
      throw new Error(
        `Failed to create customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate customer data before creation
   * @param customerData - Customer data to validate
   * @throws Error if validation fails
   */
  private validateCustomerData(customerData: CustomerPayload): void {
    if (!customerData.name || customerData.name.trim() === "") {
      throw new Error("Name is required");
    }

    if (customerData.name.length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }

    if (!customerData.lastName || customerData.lastName.trim() === "") {
      throw new Error("Last name is required");
    }

    if (customerData.lastName.length < 2) {
      throw new Error("Last name must be at least 2 characters long");
    }

    if (!customerData.phoneNumber || customerData.phoneNumber.trim() === "") {
      throw new Error("Phone number is required");
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(customerData.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Birth date is optional, but if provided, validate it
    if (customerData.birthDate) {
      // Validate birth date is not in the future
      if (customerData.birthDate > new Date()) {
        throw new Error("Birth date cannot be in the future");
      }

      // Validate birth date is reasonable (not too old)
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      if (customerData.birthDate < minDate) {
        throw new Error("Birth date seems invalid");
      }
    }

    // Validate branches array
    if (!customerData.branches || !Array.isArray(customerData.branches)) {
      throw new Error("Branches array is required");
    }

    // Validate each branch
    for (const branch of customerData.branches) {
      if (!branch.branchId || branch.branchId.trim() === "") {
        throw new Error("Branch ID is required for each branch");
      }
      if (typeof branch.acceptPromotions !== "boolean") {
        throw new Error("Accept promotions must be a boolean for each branch");
      }
    }
  }
}
