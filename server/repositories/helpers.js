export const normalizeMongoDocument = (document) => {
  if (!document) return null;

  const value = document.toObject ? document.toObject() : document;
  const { _id, __v, ...rest } = value;

  return {
    id: String(_id),
    ...rest,
  };
};
