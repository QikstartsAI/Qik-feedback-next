import { getFirebase } from "@/app/lib/firebase";
import { COLLECTION_NAME } from "@/app/constants/general";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { Customer } from "@/app/types/customer";
import { Branch, Feedback } from "@/app/types/business";

// Helper function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const distributeCustomers = (
  customers: (Customer & { feedbacks: Feedback[] })[],
  sucursales: { [key: string]: Branch }
): { [key: string]: (Customer & { feedbacks: Feedback[] })[] } => {
  const distribution: {
    [key: string]: (Customer & { feedbacks: Feedback[] })[];
  } = {};
  const sucursalIds = Object.keys(sucursales);

  // Initialize empty arrays for each sucursal
  sucursalIds.forEach((id) => {
    distribution[id] = [];
  });

  // If no sucursales, return empty distribution
  if (sucursalIds.length === 0) {
    return distribution;
  }

  // Calculate target customers per sucursal
  const targetPerSucursal = Math.floor(customers.length / sucursalIds.length);
  const remainder = customers.length % sucursalIds.length;

  // Distribute customers
  let currentSucursalIndex = 0;
  customers.forEach((customer, index) => {
    // Calculate how many customers should be in the current sucursal
    const customersInCurrentSucursal =
      targetPerSucursal + (currentSucursalIndex < remainder ? 1 : 0);

    // Add customer to current sucursal
    const currentSucursalId = sucursalIds[currentSucursalIndex];
    distribution[currentSucursalId].push(customer);

    // Move to next sucursal if current one is full
    if (distribution[currentSucursalId].length >= customersInCurrentSucursal) {
      currentSucursalIndex = (currentSucursalIndex + 1) % sucursalIds.length;
    }
  });

  return distribution;
};

const addCustomersToSucursales = async (
  businessId: string,
  customerDistribution: {
    [key: string]: (Customer & { feedbacks: Feedback[] })[];
  },
  isTest: boolean = false
): Promise<void> => {
  try {
    // Keep track of successfully moved customers
    const movedCustomers = new Set<string>();

    for (const [sucursalId, customers] of Object.entries(
      customerDistribution
    )) {
      // In test mode, only add the first customer
      const customersToAdd = isTest ? customers.slice(0, 1) : customers;

      for (const customer of customersToAdd) {
        // Create customer document reference in sucursal
        const customerRef = doc(
          collection(
            getFirebase().db,
            COLLECTION_NAME || "",
            businessId,
            "sucursales",
            sucursalId,
            "customers"
          ),
          customer.email
        );

        // Check if customer already exists in this sucursal
        const customerDoc = await getDoc(customerRef);
        if (customerDoc.exists()) {
          console.log(
            `Customer ${customer.email} already exists in sucursal ${sucursalId}, skipping...`
          );
          continue;
        }

        // Create a copy of customer without the feedbacks field
        const { feedbacks, ...customerData } = customer;

        // Add customer data
        await setDoc(customerRef, customerData);

        // Add feedbacks to the customer's feedbacks subcollection
        if (feedbacks && feedbacks.length > 0) {
          const feedbacksRef = collection(customerRef, "feedbacks");
          for (const feedback of feedbacks) {
            await setDoc(doc(feedbacksRef), feedback);
          }
        }

        // Mark customer as successfully moved
        movedCustomers.add(customer.email);
      }
    }
    // Remove successfully moved customers from main business customers list
    for (const customerEmail of Array.from(movedCustomers)) {
      const mainCustomerRef = doc(
        collection(
          getFirebase().db,
          COLLECTION_NAME || "",
          businessId,
          "customers"
        ),
        customerEmail
      );
      await deleteDoc(mainCustomerRef);
      console.log(
        `Removed customer ${customerEmail} from main business customers list`
      );
    }
  } catch (error) {
    console.error("Error adding customers to sucursales:", error);
    throw error;
  }
};

export const getBusinessCustomers = async (
  businessId: string,
  isTest: boolean = false
): Promise<{
  customers: (Customer & { feedbacks: Feedback[] })[];
  sucursales: { [key: string]: Branch };
  customerDistribution: {
    [key: string]: (Customer & { feedbacks: Feedback[] })[];
  };
}> => {
  try {
    const customersRef = collection(
      getFirebase().db,
      COLLECTION_NAME || "",
      businessId,
      "customers"
    );

    const customersSnapshot = await getDocs(customersRef);
    const customers: (Customer & { feedbacks: Feedback[] })[] = [];

    for (const doc of customersSnapshot.docs) {
      const customerData = doc.data() as Customer;

      // Get the feedbacks subcollection
      const feedbacksRef = collection(doc.ref, "feedbacks");
      const feedbacksSnapshot = await getDocs(feedbacksRef);
      const feedbacks: Feedback[] = [];

      feedbacksSnapshot.forEach((feedbackDoc) => {
        feedbacks.push(feedbackDoc.data() as Feedback);
      });

      customers.push({
        ...customerData,
        feedbacks,
      });
    }

    // Shuffle the customers array
    const shuffledCustomers = shuffleArray(customers);

    // Calculate how many customers to keep in main list (35)
    const customersToKeep = 35;
    const customersToDistribute = shuffledCustomers.slice(0, -customersToKeep);
    const remainingCustomers = shuffledCustomers.slice(-customersToKeep);

    const sucursalesRef = collection(
      getFirebase().db,
      COLLECTION_NAME || "",
      businessId,
      "sucursales"
    );
    const sucursalesSnapshot = await getDocs(sucursalesRef);
    const sucursales: { [key: string]: Branch } = {};

    for (const doc of sucursalesSnapshot.docs) {
      const sucursalesData = doc.data() as Branch;
      sucursales[doc.id] = sucursalesData;
    }

    // Distribute customers among sucursales
    const customerDistribution = distributeCustomers(
      customersToDistribute,
      sucursales
    );

    // Add customers to their respective sucursales and remove them from main list
    await addCustomersToSucursales(businessId, customerDistribution, isTest);

    // Return the remaining customers (35) and the distribution
    return {
      customers: remainingCustomers,
      sucursales,
      customerDistribution,
    };
  } catch (error) {
    console.error("Error getting business customers:", error);
    throw error;
  }
};
