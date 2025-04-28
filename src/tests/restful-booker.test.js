const axios = require("axios");
const { setAllBookingIds, getRandomBookingId, getAllBookingIds } = require("../utils/randomBookingId");
const data = require("../data/data");
const api = require("../utils/api");

let token = null;
let bookingId = null;


describe("Restful Booker API tests with Axios", () => {

  beforeAll(async () => {
    const authRes = await api.post(`${data.endpoints.auth}`, data.userCredentials);
    token = authRes.data.token;

    const bookingRes = await api.post(`${data.endpoints.booking}`, data.bookingData1);
    bookingId = bookingRes.data.bookingid;

    const res = await api.get(`${data.endpoints.booking}`);
    const ids = res.data.map(booking => booking.bookingid);
    setAllBookingIds(ids);
  });

  test("1. Create a token and booking were successful", async () => {
    await expect(token).toBeDefined();
    await expect(bookingId).toBeDefined();
  });

  test("2. Check booking IDs array", async () => {
    await expect(Array.isArray(getAllBookingIds())).toBe(true);
    await expect(getAllBookingIds().length).toBeGreaterThan(0);
  });

  test("3. Get booking by ID", async () => {
    const randomBookingId = getRandomBookingId();

    const response = await api.get(`/${data.endpoints.booking}/${randomBookingId}`);

    await expect(response.status).toBe(200);

    for (const key in data.bookingSchema) {
      await expect(response.data).toHaveProperty(key);
      const expectedType = data.bookingSchema[key];
      if (typeof expectedType === 'object') {
        await expect(typeof response.data[key]).toBe('object');
        for (const nestedKey in expectedType) {
          await expect(response.data[key]).toHaveProperty(nestedKey);
          await expect(typeof response.data[key][nestedKey]).toBe(expectedType[nestedKey]);
        }
      } else {
        await expect(typeof response.data[key]).toBe(expectedType);
      }
    }
  });

  test("4. Update booking", async () => {
    const randomBookingId = getRandomBookingId();

    const response = await api.put(`/${data.endpoints.booking}/${randomBookingId}`, data.updatedBookingData, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    await expect(response.status).toBe(200);

    for (const key in data.updatedBookingData) {
      if (typeof data.updatedBookingData[key] === 'object' && data.updatedBookingData[key] !== null) {
        for (const nestedKey in data.updatedBookingData[key]) {
          await expect(response.data[key][nestedKey]).toBe(data.updatedBookingData[key][nestedKey]);
        }
      } else {
        await expect(response.data[key]).toBe(data.updatedBookingData[key]);
      }
    }
  });

  test("5. Partial update booking", async () => {
    const randomBookingId = getRandomBookingId();

    const res = await api.patch(`/${data.endpoints.booking}/${randomBookingId}`, data.partialUpdate, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    await expect(res.status).toBe(200);
    await expect(res.data.firstname).toBe(data.partialUpdate.firstname);
    await expect(res.data.lastname).toBe(data.partialUpdate.lastname);
  });

  test("6. Delete booking", async () => {
    const randomBookingId = getRandomBookingId();

    const res = await api.delete(`/${data.endpoints.booking}/${randomBookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    await expect(res.status).toBe(201);
  });

  test("7. Create booking with empty body", async () => {
    try {
      await api.post("/${data.endpoints.booking}", {});
    } catch (error) {
      await expect(error.response.status).toBe(404);
    }
  });

  test("8. Get booking by non-existing ID", async () => {
    try {
      await api.get(`/${data.endpoints.booking}/${data.nonExistingBookingId}`);
    } catch (error) {
      await expect(error.response.status).toBe(404);
      await expect(error.response.data).toEqual('Not Found');
    }
  });

  test("9. Update booking without token", async () => {
    const randomBookingId = getRandomBookingId();

    try {
      await api.put(`/${data.endpoints.booking}/${randomBookingId}`, data.updatedBooking1);
    } catch (error) {
      await expect(error.response.status).toBe(403);
    }
  });

  test("10. Update non-existing booking ID", async () => {
    try {
      await api.put(`/${data.endpoints.booking}/${data.nonExistingBookingId}`, data.updatedBooking2, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(400);
    }
  });

  test("11. Partial update booking without token", async () => {
    const randomBookingId = getRandomBookingId();

    try {
      await api.patch(`/${data.endpoints.booking}/${randomBookingId}`, data.updatedBooking1);
    } catch (error) {
      await expect(error.response.status).toBe(403);
    }
  });

  test("12. Partial update non-existing booking ID", async () => {
    try {
      await api.patch(`/${data.endpoints.booking}/${data.nonExistingBookingId}`, data.updatedBooking2, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(405);
    }
  });

  test("13. Partial update booking with invalid token", async () => {
    const randomBookingId = getRandomBookingId();

    try {
      await api.patch(`/${data.endpoints.booking}/${randomBookingId}`, data.updatedBooking1, {
        headers: {
          Cookie: `token=${data.invalidToken}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(403);
    }
  });

  test("14. Delete booking without token", async () => {
    const randomBookingId = getRandomBookingId();

    try {
      await api.delete(`/${data.endpoints.booking}/${randomBookingId}`);
    } catch (error) {
      await expect(error.response.status).toBe(403);
    }
  });

  test("15. Delete booking with invalid token", async () => {
    const randomBookingId = getRandomBookingId();

    try {
      await api.delete(`/${data.endpoints.booking}/${randomBookingId}`, {
        headers: {
          Cookie: `token=${data.invalidToken}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(403);
    }
  });

  test("16. Delete non-existing booking ID", async () => {
    try {
      await api.delete(`/${data.endpoints.booking}/${data.nonExistingBookingId}`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(405);
    }
  });

  test("17. Delete already deleted booking", async () => {
    const randomBookingId = getRandomBookingId();
    await api.delete(`/${data.endpoints.booking}/${randomBookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    try {
      await api.delete(`/booking/${randomBookingId}`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
    } catch (error) {
      await expect(error.response.status).toBe(405);
    }
  });

});
