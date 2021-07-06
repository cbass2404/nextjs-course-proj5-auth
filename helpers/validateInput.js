const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

export const isValidInput = (input) => {
    const isValid = input.trim() === '' || !input ? false : true;

    return isValid;
};

export const isValidEmail = (input) => {
    const isValid = emailRegex.test(input);

    return isValid;
};

export const isValidPassword = (input) => {
    const isValid = passwordRegex.test(trimmedPassword);

    return isValid;
};
