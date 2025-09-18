import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface ICreateCustomerUseCase {
  execute(customerData: CustomerPayload): Promise<Customer>;
}

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Generate phone number variations to try different formats
   * @param phone - Original phone number
   * @returns Array of phone variations
   */
  private generatePhoneVariations(phone: string): string[] {
    const variations: string[] = [];
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Add original phone
    variations.push(phone);
    
    // Add digits only version
    if (digitsOnly !== phone) {
      variations.push(digitsOnly);
    }
    
    // Add with + prefix
    if (!phone.startsWith('+')) {
      variations.push(`+${digitsOnly}`);
    }
    
    // Add with country code variations (Argentina)
    if (digitsOnly.startsWith('54')) {
      variations.push(digitsOnly);
      variations.push(`+${digitsOnly}`);
    } else if (digitsOnly.startsWith('9')) {
      variations.push(`54${digitsOnly}`);
      variations.push(`+54${digitsOnly}`);
    } else if (digitsOnly.length >= 10) {
      variations.push(`549${digitsOnly}`);
      variations.push(`+549${digitsOnly}`);
    }
    
    // Add formatted versions
    if (digitsOnly.length >= 10) {
      const formatted = `+54 (${digitsOnly.slice(-10, -7)}) ${digitsOnly.slice(-7, -4)}-${digitsOnly.slice(-4)}`;
      variations.push(formatted);
    }
    
    // Remove duplicates
    return [...new Set(variations)];
  }

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
      if (error?.status === 409) {
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
            } else {
              console.warn("⚠️ [CreateCustomerUseCase] execute - No customer found by phone, but 409 conflict suggests customer exists");
              
              // If we get 409 but can't find by phone, try different phone formats
              const phoneVariations = this.generatePhoneVariations(customerData.phoneNumber);
              
              for (const phoneVariation of phoneVariations) {
                if (phoneVariation !== customerData.phoneNumber) {
                  console.log("🔍 [CreateCustomerUseCase] execute - Trying phone variation:", phoneVariation);
                  const customerByVariation = await this.customerRepository.getCustomerByPhoneNumber(phoneVariation);
                  
                  if (customerByVariation) {
                    console.log("✅ [CreateCustomerUseCase] execute - Found customer with phone variation", { 
                      customerId: customerByVariation.id,
                      originalPhone: customerData.phoneNumber,
                      foundWithPhone: phoneVariation
                    });
                    return customerByVariation;
                  }
                }
              }
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
        
        // If both searches failed, we need to throw an error because we cannot proceed without a real customer
        console.error("❌ [CreateCustomerUseCase] execute - Customer conflict but could not recover existing customer");
        throw new Error("Customer already exists but could not be recovered. Please try again or contact support.");
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
