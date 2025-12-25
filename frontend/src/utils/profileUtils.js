export const isProfileComplete = (user) => {
    if (!user) return false;

    // Check if all required fields are filled
    const hasRequiredFields = user.name && user.email;

    // Check if address is complete
    const hasCompleteAddress = user.address &&
        user.address.street &&
        user.address.city &&
        user.address.state &&
        user.address.postalCode &&
        user.address.country;

    return hasRequiredFields && hasCompleteAddress;
};

export const getMissingFields = (user) => {
    const missing = [];

    if (!user) {
        missing.push('User not logged in');
        return missing;
    }

    if (!user.name) missing.push('Full Name');
    if (!user.email) missing.push('Email Address');

    if (!user.address) {
        missing.push('Complete Address');
    } else {
        if (!user.address.street) missing.push('Street Address');
        if (!user.address.city) missing.push('City');
        if (!user.address.state) missing.push('State/Province');
        if (!user.address.postalCode) missing.push('Postal Code');
        if (!user.address.country) missing.push('Country');
    }

    return missing;
}; 