export const truncateText = ({
  text,
  truncateNumber,
}: {
  text: string;
  truncateNumber: number;
}) => {
  if (text.length <= truncateNumber) {
    return text;
  }
  return text.slice(0, truncateNumber) + "...";
};
