import { Customer, CustomerPayload } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories";
import { generateAutomaticEmail } from "@/lib/utils/emailUtils";

export interface ICustomerService {
  /**
   * Creates a customer or recovers an existing one
   * This method ensures we always get a valid customer
   * @param customerData - Customer data to create
   * @returns Promise<Customer> - Always returns a valid customer
   */
  createOrRecoverCustomer(customerData: CustomerPayload): Promise<Customer>;
}

export class CustomerService implements ICustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async createOrRecoverCustomer(customerData: CustomerPayload): Promise<Customer> {
    // Generate automatic email if not provided
    const processedCustomerData = { ...customerData };
    if (!processedCustomerData.email || processedCustomerData.email.trim() === '') {
      processedCustomerData.email = generateAutomaticEmail(
        processedCustomerData.name,
        processedCustomerData.lastName,
        processedCustomerData.phoneNumber
      );
      console.log("📧 [CustomerService] Generated automatic email:", processedCustomerData.email);
    }

    console.log("🔄 [CustomerService] createOrRecoverCustomer - Starting", {
      name: processedCustomerData.name,
      lastName: processedCustomerData.lastName,
      phoneNumber: processedCustomerData.phoneNumber ? 
        `${processedCustomerData.phoneNumber.substring(0, 4)}***` : 'N/A',
      email: processedCustomerData.email
    });

    // Step 1: Try to create the customer
    try {
      console.log("📝 [CustomerService] createOrRecoverCustomer - Attempting to create new customer");
      const newCustomer = await this.customerRepository.createCustomer(processedCustomerData);
      
      console.log("✅ [CustomerService] createOrRecoverCustomer - Customer created successfully", {
        customerId: newCustomer.id,
        customerName: newCustomer.payload?.name
      });
      
      return newCustomer;
    } catch (error: any) {
      console.log("⚠️ [CustomerService] createOrRecoverCustomer - Create failed, attempting recovery", {
        error: error.message,
        status: error.status
      });

      // Step 2: If creation failed, try to recover existing customer
      return await this.recoverExistingCustomer(processedCustomerData, error);
    }
  }

  private async recoverExistingCustomer(
    customerData: CustomerPayload, 
    originalError: any
  ): Promise<Customer> {
    console.log("🔍 [CustomerService] recoverExistingCustomer - Starting recovery process");

    // Handle 409 Conflict - Customer already exists
    if (originalError?.status === 409) {
      console.log("🔄 [CustomerService] recoverExistingCustomer - 409 Conflict detected, customer exists");
      
      // Try to recover by phone number (most reliable)
      if (customerData.phoneNumber) {
        const customerByPhone = await this.recoverByPhone(customerData.phoneNumber);
        if (customerByPhone) {
          return customerByPhone;
        }
      }

      // Try to recover by email (fallback)
      if (customerData.email) {
        const customerByEmail = await this.recoverByEmail(customerData.email);
        if (customerByEmail) {
          return customerByEmail;
        }
      }

      // If both recovery methods failed, throw a more descriptive error
      throw new Error(
        `Customer already exists but could not be recovered. ` +
        `Please try again or contact support. Original error: ${originalError.message}`
      );
    }

    // Handle other errors (500, network issues, etc.)
    console.log("🔄 [CustomerService] recoverExistingCustomer - Non-409 error, attempting recovery anyway");
    
    // Even for non-409 errors, try to recover existing customer
    if (customerData.phoneNumber) {
      const customerByPhone = await this.recoverByPhone(customerData.phoneNumber);
      if (customerByPhone) {
        console.log("✅ [CustomerService] recoverExistingCustomer - Recovered existing customer by phone");
        return customerByPhone;
      }
    }

    if (customerData.email) {
      const customerByEmail = await this.recoverByEmail(customerData.email);
      if (customerByEmail) {
        console.log("✅ [CustomerService] recoverExistingCustomer - Recovered existing customer by email");
        return customerByEmail;
      }
    }

    // If all recovery attempts failed, throw the original error
    console.error("❌ [CustomerService] recoverExistingCustomer - All recovery attempts failed");
    throw new Error(
      `Failed to create or recover customer: ${originalError.message}`
    );
  }

  private async recoverByPhone(phoneNumber: string): Promise<Customer | null> {
    try {
      console.log("📞 [CustomerService] recoverByPhone - Searching by phone", {
        phone: phoneNumber.substring(0, 4) + "***"
      });

      const customer = await this.customerRepository.getCustomerByPhoneNumber(phoneNumber);
      
      if (customer) {
        console.log("✅ [CustomerService] recoverByPhone - Customer found", {
          customerId: customer.id,
          customerName: customer.payload?.name
        });
        return customer;
      }

      // Try phone variations if direct search failed
      const phoneVariations = this.generatePhoneVariations(phoneNumber);
      for (const variation of phoneVariations) {
        if (variation !== phoneNumber) {
          console.log("🔍 [CustomerService] recoverByPhone - Trying phone variation", {
            variation: variation.substring(0, 4) + "***"
          });
          
          const customerByVariation = await this.customerRepository.getCustomerByPhoneNumber(variation);
          if (customerByVariation) {
            console.log("✅ [CustomerService] recoverByPhone - Customer found with variation", {
              customerId: customerByVariation.id,
              originalPhone: phoneNumber.substring(0, 4) + "***",
              foundWithPhone: variation.substring(0, 4) + "***"
            });
            return customerByVariation;
          }
        }
      }

      console.log("❌ [CustomerService] recoverByPhone - No customer found");
      return null;
    } catch (error) {
      console.error("❌ [CustomerService] recoverByPhone - Error during phone recovery", error);
      return null;
    }
  }

  private async recoverByEmail(email: string): Promise<Customer | null> {
    try {
      console.log("📧 [CustomerService] recoverByEmail - Searching by email", {
        email: email.substring(0, 3) + "***"
      });

      const customer = await this.customerRepository.getCustomerByEmail(email);
      
      if (customer) {
        console.log("✅ [CustomerService] recoverByEmail - Customer found", {
          customerId: customer.id,
          customerName: customer.payload?.name
        });
        return customer;
      }

      console.log("❌ [CustomerService] recoverByEmail - No customer found");
      return null;
    } catch (error) {
      console.error("❌ [CustomerService] recoverByEmail - Error during email recovery", error);
      return null;
    }
  }

  private generatePhoneVariations(phoneNumber: string): string[] {
    const variations: string[] = [];
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Add variations with different country codes (only numbers, no +)
    if (digitsOnly.startsWith('57')) {
      // Colombian number
      variations.push(digitsOnly); // Full number with country code
      variations.push(digitsOnly.substring(2)); // Without country code
    } else if (digitsOnly.startsWith('1')) {
      // US/Canada number
      variations.push(digitsOnly); // Full number with country code
      variations.push(digitsOnly.substring(1)); // Without country code
    } else if (digitsOnly.startsWith('593')) {
      // Ecuador number
      variations.push(digitsOnly); // Full number with country code
      variations.push(digitsOnly.substring(3)); // Without country code
    } else {
      // Other formats - just the digits as they are
      variations.push(digitsOnly);
    }
    
    // Remove duplicates and empty strings
    return [...new Set(variations)].filter(v => v.length > 0);
  }
}

