// utils/asyncHandler.js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };


// const asyncHanlder = (fn) => {
//   async (req, res, next) => {
//     try {
//     } catch (error) {
//       await fn(req, res, next);
//       res.status(error.code || 500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
// };
