/**
 * Restricts username to alphanumeric and underscore and period
 */

module.exports = function isValid(username) {
  const output = { 
    status: true,
    message: 'valid',
  };
  const regex = RegExp("^[a-zA-Z0-9_.]*$");

  if (regex.test(username) === false) {
    output.status = false;
    output.message = "username can only contain letters, numbers, underscores and periods";
  };
  if (username.includes("__") === true) {
    output.status = false;
    output.message = "username cannot contain a double underscore";
  };
  if (username[0] === "_" || username[0] === ".") {
    output.status = false;
    output.message = "username cannot begin with an underscore or period";
  };
  
  return output;
};
