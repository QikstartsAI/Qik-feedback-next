import React, { useState } from "react";
import { CustomerProvider, useCustomerContext } from "@/lib/data/context";
import { CustomerPayload, CustomerType } from "@/lib/domain/entities";

function CustomerForm() {
  const { createCustomer, loading, error, clearError } = useCustomerContext();
  const [formData, setFormData] = useState<CustomerPayload>({
    fullName: "",
    customerType: CustomerType.New,
    birthDate: new Date(),
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const customer = await createCustomer(formData);
    if (customer) {
      setFormData({
        fullName: "",
        customerType: CustomerType.New,
        birthDate: new Date(),
        phoneNumber: "",
      });
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Create Customer</h3>

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
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Customer"}
        </button>
      </form>
    </div>
  );
}

function CustomerSearch() {
  const { getCustomerByPhone, getCustomerById, loading, error, clearError } =
    useCustomerContext();
  const [searchType, setSearchType] = useState<"phone" | "id">("phone");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (searchType === "phone") {
      await getCustomerByPhone(searchValue);
    } else {
      await getCustomerById(searchValue);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Search Customer</h3>

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
          className="w-full p-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
}

function CustomerUpdate() {
  const { currentCustomer, updateCustomer, loading, error, clearError } =
    useCustomerContext();
  const [updateData, setUpdateData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    clearError();

    const updatePayload: Partial<CustomerPayload> = {};
    if (updateData.fullName) updatePayload.fullName = updateData.fullName;
    if (updateData.phoneNumber)
      updatePayload.phoneNumber = updateData.phoneNumber;

    if (Object.keys(updatePayload).length > 0) {
      await updateCustomer(currentCustomer.id, updatePayload);
      setUpdateData({ fullName: "", phoneNumber: "" });
    }
  };

  if (!currentCustomer) {
    return (
      <div className="p-4 border rounded">
        <h3 className="text-lg font-semibold mb-4">Update Customer</h3>
        <p className="text-gray-500">
          Search for a customer first to update their information.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Update Customer</h3>

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

      <form onSubmit={handleUpdate} className="space-y-4">
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
          {loading ? "Updating..." : "Update Customer"}
        </button>
      </form>
    </div>
  );
}

function CustomerDisplay() {
  const { currentCustomer, customers, clearCurrentCustomer, clearCustomers } =
    useCustomerContext();

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <div className="space-x-2">
          <button
            onClick={clearCurrentCustomer}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
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
      </div>

      {currentCustomer ? (
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-semibold">Current Customer:</h4>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(currentCustomer, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-gray-500">
          No customer selected. Search for a customer to see details.
        </p>
      )}

      {customers.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            All Customers ({customers.length}):
          </h4>
          <div className="space-y-2">
            {customers.map((customer) => (
              <div key={customer.id} className="p-2 bg-gray-50 rounded text-sm">
                <strong>{customer.payload.fullName}</strong> -{" "}
                {customer.payload.phoneNumber}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerContextExampleContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Customer Context Example
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerForm />
        <CustomerSearch />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerUpdate />
        <CustomerDisplay />
      </div>
    </div>
  );
}

export function CustomerContextExample() {
  return (
    <CustomerProvider>
      <CustomerContextExampleContent />
    </CustomerProvider>
  );
}
