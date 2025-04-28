module.exports = {
    endpoints: {
        auth: 'auth',
        booking: 'booking'
    },

    bookingData: {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
            checkin: '2024-04-10',
            checkout: '2024-04-15',
        },
        additionalneeds: 'Breakfast',
    },
    
    bookingSchema: {
        firstname: 'string',
        lastname: 'string',
        totalprice: 'number',
        depositpaid: 'boolean',
        bookingdates: {
            checkin: 'string',
            checkout: 'string',
        },
        additionalneeds: 'string',
    },

    updatedBookingData: {
        firstname: "Jane",
        lastname: "Smith",
        totalprice: 150,
        depositpaid: false,
        bookingdates: {
            checkin: "2025-04-20",
            checkout: "2025-04-25",
        },
        additionalneeds: "Dinner",
    },

    partialUpdate: {
        firstname: "James",
        lastname: "Brown",
    },

    updatedBooking1: {
        firstname: "NoAuth",
        lastname: "User",
    },

    updatedBooking2: {
        firstname: "Invalid",
        lastname: "User",
    },

    nonExistingBookingId: 12345,
    invalidToken : "invalidtoken123"
};
