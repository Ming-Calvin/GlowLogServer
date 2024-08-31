// response format

// if success
function successResponse(res) {
  return {
    status: 200,
    data: res
  }
}

// if error
function FailureResponse(err) {
  return {
    status: 500,
    err
  }
}

module.exports = { successResponse, FailureResponse }