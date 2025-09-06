export const copyUrlToClipboard = async () => {
  await navigator.clipboard.writeText(window.location.href);
};
