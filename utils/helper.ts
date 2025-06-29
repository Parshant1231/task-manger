export const validateEmail = (email: any) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const addThousandsSeparator = (
  num: number | null | undefined
): string => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const getFirstName = (name: any) => {
  const first = name.trim().split(" ")[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};
