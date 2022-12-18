/**
 *
 * @param {Buffer} imageBuffer
 */
export const encodeBufferToBase64 = (imageBuffer) => {
  if (!imageBuffer) return "";
  return (
    "data:image/jpg;base64, " +
    Buffer.from(imageBuffer.data, "utf-8").toString("base64")
  );
};

export const getAddressRemovedPath = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.length > 18 && imgPath.substring(0, 18) === "1.214.203.131:3330")
    return imgPath.substring(18, imgPath.length);

  return imgPath;
};
