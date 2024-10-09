import BaseHashIds from "hashids";

export const Hashids = (prefix: string, length = 12) => {
  return new BaseHashIds(`${process.env.HASHID_SALT}:${prefix}`, length);
};
