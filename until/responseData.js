// success response format
function successResponse(message, data) {
  return {
    code: 200,
    message,
    data: {
      ...data
    }
  }
}

// error response format
function failureResponse(message, err, errCode) {
  return {
    code: errCode || 500,
    message,
    err: {
      ...err
    }
  }
}

module.exports = { successResponse, failureResponse }