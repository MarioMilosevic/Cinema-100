export const calculatePageButtons = (totalItems: number, divisor: number) => {
  const pageButtons = []
  const totalPageButtons = Math.ceil(totalItems / divisor)
  for (let i = 0; i < totalPageButtons; i++) {
    pageButtons.push(i)
  }
  return pageButtons
}
