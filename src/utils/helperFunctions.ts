export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4, address.length)}`
}