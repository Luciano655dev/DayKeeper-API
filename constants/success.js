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
      code: 200,
      message: `${data} created successfully`,
      ...props,
    }
  },
  deleted: (data, props) => {
    return {
      code: 200,
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
  custom: (message, props, code) => {
    return {
      code: code || 200,
      message: message || ``,
      ...props,
    }
  },
}
