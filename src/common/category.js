export function replcestr (completestr, rangelocation, oldStr, newStr) {
  let firstcom = completestr.substring(0, rangelocation)
  let lastcom = completestr.substring(rangelocation, completestr.length)
  return firstcom + lastcom.replace(oldStr, newStr)
}
