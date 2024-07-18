export const formatDate = (dateString) => {
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  const date = new Date(dateString);
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Hôm nay";
  }
  return daysOfWeek[date.getDay()];
};
export const dayAndMonth = (date) => {
  let dateObj = new Date(date);
  let day = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  return `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}`;
};
export const formatBirthDate = (birthDate) => {
  const dateStr = birthDate;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
};
