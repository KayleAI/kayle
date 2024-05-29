export function observeText(
  text: string
) {
  if (text.trim() === "") {
    return {
      text,
      skip: true
    };
  }

  // here, we'll make suitable replacements to the text
  // for example, anti-spam like `░L░I░N░K░I░N░B░I░O░`

  return {
    text,
    skip: false
  };
}