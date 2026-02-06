export const truncateText = (text: string): string => {
  if (text.length <= 200) {
    return text;
  }
  return text.slice(0, 200) + "...";
};
