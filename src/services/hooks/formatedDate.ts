export const formattedDate = (date: Date | string): string => {
  let parsedDate: Date;

  if (typeof date === "string") {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};