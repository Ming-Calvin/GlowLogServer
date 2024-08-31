// success response format
function successResponse(message, data) {
  return {
    status: 200,
    data: {
      message,
      ...data
    }
  }
}

// error response format
function failureResponse(message, err, errCode) {
  return {
    status: errCode || 500,
    err: {
      message,
      ...err
    }
  }
}

module.exports = { successResponse, failureResponse }