const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  }
}

const errorHandler = (msg, status = 500) => {
  let error = new Error(msg)
  error.status = status
  return error
}

module.exports = {
  updateObject,
  errorHandler,
}
