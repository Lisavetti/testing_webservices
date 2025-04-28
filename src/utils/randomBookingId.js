let allBookingIds = [];

function setAllBookingIds(ids) {
  allBookingIds = ids;
}

function getRandomBookingId() {
  if (!allBookingIds.length) {
    throw new Error('No booking IDs available');
  }
  const randomIndex = Math.floor(Math.random() * allBookingIds.length);
  return allBookingIds[randomIndex];
}

function getAllBookingIds() {
  if (!allBookingIds.length) {
    throw new Error('No booking IDs available');
  }
  return allBookingIds;
}

module.exports = {
  setAllBookingIds,
  getRandomBookingId,
  getAllBookingIds,
};