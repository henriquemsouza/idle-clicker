import { STORAGE_KEYS } from "../utils/storage/constants";
import { Storage } from "../utils/storage/storage";

export const InitialState = {
  count: 0,
  totalCount: 0,
  delta: 1,
  upgradesPurchased: [],
  purchasesPurchased: [],
};

export const GetInitialState = () => {
  const countValue = Storage.getData(STORAGE_KEYS.COUNT);
  const totalCountValue = Storage.getData(STORAGE_KEYS.TOTAL_COUNT);

  return {
    count: Number(countValue) ?? 0,
    totalCount:  Number(totalCountValue) ?? 0,
    delta: 1,
    upgradesPurchased: [],
    purchasesPurchased: [],
  };
};
