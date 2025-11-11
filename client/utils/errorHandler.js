export const extractErrorMessage = (
  error,
  fallbackMessage = "Something went wrong. Please try again."
) => {
  // 1️⃣ Backend-provided message
  const backendMessage = error?.response?.data?.message;
  if (backendMessage) return backendMessage;

  // 2️⃣ Validation errors (array of messages)
  const validationErrors = error?.response?.data?.errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.join(", ");
  }

  // 3️⃣ HTTP Status-based friendly messages
  const status = error?.response?.status;
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Invalid credentials. Please check your email and password.";
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 408:
      return "Request timed out. Please try again later.";
    case 500:
      return "Server error. Please try again after some time.";
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    default:
      break;
  }

  // 4️⃣ Network-level or unexpected errors
  if (error?.message?.includes("Network Error")) {
    return "Network error. Please check your internet connection.";
  }

  // 5️⃣ Default fallback
  return fallbackMessage;
};


//Extracts full error details for logging/debugging
export const extractErrorDetails = (error) => {
  if (error?.response?.data) {
    return {
      statusCode: error.response.data.statusCode,
      message: error.response.data.message,
      errors: error.response.data.errors || [],
      success: error.response.data.success,
    };
  }

  return {
    statusCode: error.response?.status || 500,
    message: error?.message || "Unknown error",
    errors: [],
    success: false,
  };
};
