const axios = require("axios");

let token = null;
let bookingId = [];

const api = axios.create({
  baseURL: "https://restful-booker.herokuapp.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

describe("Restful Booker API tests with Axios", () => {

  test("1. Create a token", async () => {
    const res = await api.post("/auth", {
      username: "admin",
      password: "password123",
    });

    expect(res.status).toBe(200);
    token = res.data.token;
    expect(res.data.token).toBeDefined();
  });

  test("2. Create a booking", async () => {
    const bookingData = {
      firstname: "John",
      lastname: "Doe",
      totalprice: 111,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-12-01",
        checkout: "2024-12-10"
      },
      additionalneeds: "Breakfast"
    };

    const res = await api.post("/booking", bookingData);

    bookingId.push(res.data.bookingid);
    expect(res.status).toBe(200);
    expect(res.data.bookingid).toBeDefined();
  });

  test("3. Get booking IDs", async () => {
    const res = await api.get("/booking");

    expect(res.status).toBe(200);
  });

  test("4. Get booking by ID", async () => {
    const res = await api.get(`/booking/${bookingId}`);
  
    expect(res.status).toBe(200);
    // console.log(res.data);
    expect(res.data).toHaveProperty("firstname");
    expect(res.data).toHaveProperty("lastname");
  });
  
  test("5. Update booking", async () => {
    const updatedBooking = {
      firstname: "Jane",
      lastname: "Smith",
      totalprice: 150,
      depositpaid: false,
      bookingdates: {
        checkin: "2025-04-20",
        checkout: "2025-04-25",
      },
      additionalneeds: "Dinner",
    };

    const res = await api.put(`/booking/${bookingId}`, updatedBooking, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    // console.log(res.data);
    expect(res.status).toBe(200);
    expect(res.data.firstname).toBe("Jane");
  });

  test("6. Partial update booking", async () => {
    const partialUpdate = {
      firstname: "James",
      lastname: "Brown",
    };
  
    const res = await api.patch(`/booking/${bookingId}`, partialUpdate, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  
    expect(res.status).toBe(200);
    expect(res.data.firstname).toBe("James");
    expect(res.data.lastname).toBe("Brown");
  });
  
  test("7. Delete booking", async () => {
    const res = await api.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    expect(res.status).toBe(201);
  });
});
