// Core services
export const HTTP_CLIENT = Symbol("HttpClient");
export const API_BASE_URL = Symbol("ApiBaseUrl");

// Repository services
export const CUSTOMER_REPOSITORY = Symbol("CustomerRepository");
export const BRANCH_REPOSITORY = Symbol("BranchRepository");
export const FEEDBACK_REPOSITORY = Symbol("FeedbackRepository");
export const WAITER_REPOSITORY = Symbol("WaiterRepository");

// Use case services
export const GET_CUSTOMER_BY_ID_USE_CASE = Symbol("GetCustomerByIdUseCase");
export const GET_CUSTOMER_BY_PHONE_USE_CASE = Symbol(
  "GetCustomerByPhoneNumberUseCase"
);
export const CREATE_CUSTOMER_USE_CASE = Symbol("CreateCustomerUseCase");
export const UPDATE_CUSTOMER_USE_CASE = Symbol("UpdateCustomerUseCase");
export const GET_BRANCH_BY_ID_USE_CASE = Symbol("GetBranchByIdUseCase");
export const GET_WAITER_BY_ID_USE_CASE = Symbol("GetWaiterByIdUseCase");
export const SEND_FEEDBACK_USE_CASE = Symbol("SendFeedbackUseCase");
