import bcrypt from 'bcrypt'

const validatePassword = (password) => {

    if (password.length < 8 )
        return 'Password is too short (min-length: 8 chars)';
    return true;
};
const  validateSetPassword = (newPass, rep) => {

    if (newPass.toString().localeCompare(rep.toString()) !== 0)
    {
        return "Passwords do not match";
    }
    return validatePassword(newPass);

};
const validateEmail = (email) => {
    if (email.length > 40 )
        return 'Email is too long (max-length: 40)';
    if (email.search(/^(\w|\.){4,25}@([a-z]){1,8}.([a-z]){2,5}$/) === -1)
        return 'Email is not valid!';
    return true;
};
const validateLogin = (login) => {
    if (login.length < 6 || login.length > 30)
        return 'Login is too short (valid length: 6-30 chars)';
    if (login.search(/^(\w|\.){6,30}$/) === -1)
        return 'Allowed symbols for login: a-z A-Z 0-9 and _';
    return true;
};
const validateName = (name, fieldName) => {
    if (name.length < 2 || name.length > 30)
        return `${fieldName} is too short (min-length: 2 chars)`;
    if (name.search(/^([a-zA-Z]){2,30}$/) === -1)
        return `${fieldName} can contain only latin letters`;
    return true;
};
const validateAll = (fields) => {
    let errors = [];
    //while (fields.length !== i)
    if (fields.password.toString().localeCompare(fields.passwordRepeat.toString()) !== 0)
    {
        errors.push("Passwords do not match");
    }
    let toPush = validatePassword(fields.password);
    if (toPush !== true)
        errors.push(toPush);
    toPush = validateEmail(fields.email);
    if (toPush !== true)
        errors.push(toPush);
    toPush = validateLogin(fields.login);
    if (toPush !== true)
        errors.push(toPush);
    toPush = validateName(fields.name, "Name");
    if (toPush !== true)
        errors.push(toPush);
    toPush = validateName(fields.lastName, "Last name");
    if (toPush !== true)
        errors.push(toPush);
    return errors;
};
module.exports.validateReg = validateAll;
module.exports.validateLogin = validateLogin;
module.exports.validateEmail = validateEmail;
module.exports.validateSetPassword = validateSetPassword;