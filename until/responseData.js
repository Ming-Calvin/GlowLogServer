// success response format
function successResponse(message, data) {
  return {
    status: 200,
    message,
    data: {
      ...data
    }
  }
}

// error response format
function FailureResponse(message, err, errCode) {
  return {
    status: errCode || 500,
    body: {
      status: errCode || 500,
      message,
      err: {
        ...err
      }
    }
  }
}

module.exports = { successResponse, FailureResponse }