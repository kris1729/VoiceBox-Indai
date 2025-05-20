// Standardize API responses
const standardizeResponse = (req, res, next) => {
  // Store the original res.json function
  const originalJson = res.json;

  // Override res.json to standardize the response format
  res.json = function (data) {
    let standardizedResponse;

    // If data is an error response (typically from catch blocks)
    if (data.error || data.message?.toLowerCase().includes('error') || res.statusCode >= 400) {
      standardizedResponse = {
        success: false,
        message: data.message || data.error || 'An error occurred',
        error: data.error || data.message || 'Unknown error',
      };
    }
    // If it's a success response
    else {
      standardizedResponse = {
        success: true,
        message: data.message || 'Operation successful',
        data: data.token || data.user || data.department || data,
      };

      // Handle authentication responses
      if (data.token) {
        standardizedResponse.token = data.token;
        if (data.user) {
          standardizedResponse.user = {
            ...data.user,
            role: 'user'
          };
        }
        if (data.department) {
          standardizedResponse.user = {
            ...data.department,
            role: 'department'
          };
        }
      }
    }

    // Call the original res.json with our standardized response
    return originalJson.call(this, standardizedResponse);
  };

  next();
};

export default standardizeResponse; 