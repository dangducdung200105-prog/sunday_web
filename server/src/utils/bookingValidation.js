const isValidTimeFormat = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const isValidDateFormat = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const isPastDate = (date) => {
  const today = new Date();

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return date < todayString;
};

module.exports = {
  isValidTimeFormat,
  timeToMinutes,
  isValidDateFormat,
  isPastDate,
};
