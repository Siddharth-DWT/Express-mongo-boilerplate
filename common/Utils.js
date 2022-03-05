module.exports = {
  capitalizeAllFirst(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  },

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
  serverErrorResponse: function (res, data) {
    res.status(500).json({
      status: "error",
      message: "Server error",
      data: data,
    });
  },
};
