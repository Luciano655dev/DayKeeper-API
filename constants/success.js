module.exports = {
  updated: (data, props) => {
    return {
      code: 200,
      message: `${data} updated successfully`,
      ...props,
    }
  },
  created: (data, props) => {
    return {
      code: 201,
      message: `${data} created successfully`,
      ...props,
    }
  },
  deleted: (data, props) => {
    return {
      code: 204,
      message: `${data} deleted successfully`,
      ...props,
    }
  },
  fetched: (data, props) => {
    return {
      code: 200,
      message: `${data} fetched successfully`,
      ...props,
    }
  },
  reseted: (data, props) => {
    return {
      code: 205,
      message: `${data} reseted successfully`,
      ...props,
    }
  },
  custom: (message, code, props) => {
    return {
      code: code || 200,
      message: message || ``,
      ...props,
    }
  },
}
