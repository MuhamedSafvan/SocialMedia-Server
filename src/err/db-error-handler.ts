"use strict";

/*--------------------------------------------------------
 * Get unique error field name
 *--------------------------------------------------------*/
const uniqueMessage = (error: any): string => {
  let output;
  try {
    let fieldName = error.message.substring(error.message.lastIndexOf(".$") + 2, error.message.lastIndexOf("_1"));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }
  return output;
};

/*--------------------------------------------------------
 * Get the error message from the error object
 *--------------------------------------------------------*/
export const errorHandler = (error: any): string => {
  let message = "";
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
    }
  } else {
    if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
      message = "No data found";
    }
    for (let errorName in error.errors) {
      if (error.errors[errorName].message) {
        message = error.errors[errorName].message;
      }
    }
  }
  if (message.includes("Path")) {
    message = message.slice(6);
  }
  return message;
};
