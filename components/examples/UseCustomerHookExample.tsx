import React, { useState } from "react";
import { CustomerProvider } from "@/lib/data/context";
import {
  useCustomer,
  useCustomerSearch,
  useCustomerCreation,
  useCustomerUpdate,
} from "@/hooks/useCustomer";
import { CustomerPayload, CustomerType } from "@/lib/domain/entities";

function CustomerSearchExample() {
  const { searchById, searchByPhone, loading, error, clearError } =
    useCustomerSearch();
  const [searchType, setSearchType] = useState<"phone" | "id">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    try {
      if (searchType === "phone") {
        const customer = await searchByPhone(searchValue);
        setResult(customer);
      } else {
        const customer = await searchById(searchValue);
        setResult(customer);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">
        Customer Search (useCustomerSearch)
      </h3>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search Type</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "phone" | "id")}
            className="w-full p-2 border rounded"
          >
            <option value="phone">Phone Number</option>
            <option value="id">Customer ID</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {searchType === "phone" ? "Phone Number" : "Customer ID"}
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <h4 className="font-semibold">Search Result:</h4>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CustomerCreationExample() {
  const { create, loading, error, clearError } = useCustomerCreation();
  const [formData, setFormData] = useState<CustomerPayload>({
    fullName: "",
    customerType: CustomerType.New,
    birthDate: new Date(),
    phoneNumber: "",
  });
  const [createdCustomer, setCreatedCustomer] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setCreatedCustomer(null);

    try {
      const customer = await create(formData);
      if (customer) {
        setCreatedCustomer(customer);
        setFormData({
          fullName: "",
          customerType: CustomerType.New,
          birthDate: new Date(),
          phoneNumber: "",
        });
      }
    } catch (err) {
      console.error("Creation error:", err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">
        Customer Creation (useCustomerCreation)
      </h3>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Customer Type
          </label>
          <select
            value={formData.customerType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                customerType: Number(e.target.value),
              }))
            }
            className="w-full p-2 border rounded"
          >
            <option value={CustomerType.New}>New</option>
            <option value={CustomerType.Frequent}>Frequent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Birth Date</label>
          <input
            type="date"
            value={formData.birthDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                birthDate: new Date(e.target.value),
              }))
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Customer"}
        </button>
      </form>

      {createdCustomer && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <h4 className="font-semibold">Created Customer:</h4>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(createdCustomer, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CustomerUpdateExample() {
  const {
    update,
    updateCurrentCustomer,
    currentCustomer,
    loading,
    error,
    clearError,
  } = useCustomerUpdate();
  const [updateData, setUpdateData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [updatedCustomer, setUpdatedCustomer] = useState<any>(null);

  const handleUpdateCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    clearError();
    setUpdatedCustomer(null);

    try {
      const updatePayload: Partial<CustomerPayload> = {};
      if (updateData.fullName) updatePayload.fullName = updateData.fullName;
      if (updateData.phoneNumber)
        updatePayload.phoneNumber = updateData.phoneNumber;

      if (Object.keys(updatePayload).length > 0) {
        const customer = await updateCurrentCustomer(updatePayload);
        if (customer) {
          setUpdatedCustomer(customer);
          setUpdateData({ fullName: "", phoneNumber: "" });
        }
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!currentCustomer) {
    return (
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-4">
          Customer Update (useCustomerUpdate)
        </h3>
        <p className="text-gray-500">
          Search for a customer first to update their information.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">
        Customer Update (useCustomerUpdate)
      </h3>

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p>
          <strong>Current Customer:</strong> {currentCustomer.payload.fullName}
        </p>
        <p>
          <strong>Phone:</strong> {currentCustomer.payload.phoneNumber}
        </p>
        <p>
          <strong>Type:</strong>{" "}
          {CustomerType[currentCustomer.payload.customerType]}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleUpdateCurrent} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            New Full Name
          </label>
          <input
            type="text"
            value={updateData.fullName}
            onChange={(e) =>
              setUpdateData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full p-2 border rounded"
            placeholder="Leave empty to keep current"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            New Phone Number
          </label>
          <input
            type="tel"
            value={updateData.phoneNumber}
            onChange={(e) =>
              setUpdateData((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            placeholder="Leave empty to keep current"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Current Customer"}
        </button>
      </form>

      {updatedCustomer && (
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <h4 className="font-semibold">Updated Customer:</h4>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(updatedCustomer, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function CustomerStateExample() {
  const {
    currentCustomer,
    customers,
    loading,
    error,
    clearError,
    clearCurrentCustomer,
    clearCustomers,
    findCustomerById,
    findCustomerByPhone,
    hasCustomer,
    getCustomerCount,
  } = useCustomer();

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">
        Customer State (useCustomer)
      </h3>

      <div className="mb-4 space-y-2">
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Error:</strong> {error || "None"}
        </p>
        <p>
          <strong>Current Customer:</strong>{" "}
          {currentCustomer ? currentCustomer.payload.fullName : "None"}
        </p>
        <p>
          <strong>Total Customers:</strong> {getCustomerCount()}
        </p>
        <p>
          <strong>Has Current Customer:</strong>{" "}
          {hasCustomer(currentCustomer?.id || "") ? "Yes" : "No"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-x-2 mb-4">
        <button
          onClick={clearError}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Clear Error
        </button>
        <button
          onClick={clearCurrentCustomer}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Clear Current
        </button>
        <button
          onClick={clearCustomers}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          Clear All
        </button>
      </div>

      {customers.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">
            All Customers ({customers.length}):
          </h4>
          <div className="space-y-2">
            {customers.map((customer) => (
              <div key={customer.id} className="p-2 bg-gray-50 rounded text-sm">
                <strong>{customer.payload.fullName}</strong> -{" "}
                {customer.payload.phoneNumber}
                <br />
                <small>ID: {customer.id}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UseCustomerHookExampleContent() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        useCustomer Hooks Example
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerSearchExample />
        <CustomerCreationExample />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerUpdateExample />
        <CustomerStateExample />
      </div>
    </div>
  );
}

export function UseCustomerHookExample() {
  return (
    <CustomerProvider>
      <UseCustomerHookExampleContent />
    </CustomerProvider>
  );
}
