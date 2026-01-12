module.exports = {
  errorGif: {
    title: "404",
    id: "",
    url: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzc0OGh3NWQxbTdqcjZqaDZudXQyMHM3b3VpdXF4czczaGl4bHZicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8L0Pky6C83SzkzU55a/giphy.gif",
  },
  errors: {
    serverError: (error) => {
      return {
        code: 500,
        message: `Server error. If possible, contact an administrator and provide the necessary information... Error: "${error.message}"`,
      }
    },
    notFound: (data) => {
      return {
        code: 404,
        message: `${data} not found`,
      }
    },
    inputTooLong: (data) => {
      return {
        code: 413,
        message: `The ${data} is too long`,
      }
    },
    fieldNotFilledIn: (field) => {
      return {
        code: 400,
        message: `${field} is not filled in`,
      }
    },
    unauthorized: (action, reason) => {
      return {
        code: 403,
        message: `You don't have authorization to "${action}"`,
        reason,
      }
    },
    invalidValue: (value, props) => {
      return {
        code: 401,
        message: `Enter a valid ${value}`,
        ...props,
      }
    },
    maxQuantityToday: (value, props) => {
      return {
        code: 429,
        message: `you reached the maximum amount of ${value} today`,
        ...props,
      }
    },
    doubleAction: () => {
      return {
        code: 409,
        message: "you have already done this action",
      }
    },
    duplicatedValue: (value, props = {}) => {
      return {
        code: 409,
        message: `${value} is already in use`,
        ...props,
      }
    },
    custom: (message, props, code) => {
      return {
        code: code || 400,
        message,
        ...props,
      }
    },
  },
}
