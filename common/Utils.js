module.exports = {
  successResponse: function (res, data, message, code) {
    res.status(code).json({
      status: "success",
      message: message,
      data: data,
    });
  },
  errorResponse: function (res, data, message, code) {
    res.status(code).json({
      status: "error",
      message: message,
      data: data,
    });
  },
};
