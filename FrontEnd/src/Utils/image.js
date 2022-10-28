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
