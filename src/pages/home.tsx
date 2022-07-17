import React, { useCallback, useEffect, useMemo, useState } from "react";

import CountButton from "../components/count-button/count-button";
import { ResetButtonStyled } from "../components/styled/reset-button.styled";
import { TextGeneralContainer } from "../components/styled/text-general-container.styled";
import { TextItemContainer } from "../components/styled/text-item-container.styled";
import UpgradeButton from "../components/upgrade-button";
import { purchases } from "../data/purchases.data";
import { upgrades } from "../data/upgrades.data";
import { PurchaseInterface } from "../interfaces/purchase.interface";
import { GetInitialState } from "../utils/initial";
import { STORAGE_KEYS } from "../utils/storage/constants";
import { Storage } from "../utils/storage/storage";

const initialState = GetInitialState();

const Home = () => {
  const [totalCount, setTotalCount] = useState(initialState.totalCount);
  const [count, setCount] = useState(initialState.count);
  const [delta, setDelta] = useState(initialState.delta);
  const [upgradesPurchased, setUpgradesPurchased] = useState<string[]>(
    initialState.upgradesPurchased
  );
  const [purchasesPurchased, setPurchasesPurchased] = useState<
    PurchaseInterface[]
  >(initialState.purchasesPurchased);

  const increaseCount = (delta: number) => {
    const currentTotalCount = totalCount + Math.round(delta * 100) / 100;
    const currentCount = count + Math.round(delta * 100) / 100;

    setTotalCount(currentTotalCount);
    setCount(currentCount);

    Storage.setData(STORAGE_KEYS.TOTAL_COUNT, currentTotalCount);
    Storage.setData(STORAGE_KEYS.COUNT, currentCount);
  };

  const decreaseCount = useCallback(
    (delta: number) => {
      setCount(count - delta);
    },
    [count]
  );

  const reset = () => {
    setCount(initialState.count);
    setTotalCount(initialState.totalCount);
    setDelta(initialState.delta);
    setUpgradesPurchased(initialState.upgradesPurchased);
    setPurchasesPurchased(initialState.purchasesPurchased);

    Storage.removeData(STORAGE_KEYS.COUNT);
    Storage.removeData(STORAGE_KEYS.TOTAL_COUNT);
  };

  const upgradeMarkup = upgrades.map((upgrade) => {
    const purchased = upgradesPurchased.includes(upgrade.id);

    return (
      <UpgradeButton
        key={upgrade.id}
        callback={() => decreaseCount(upgrade.cost)}
        upgradeCallback={() =>
          setUpgradesPurchased([upgrade.id, ...upgradesPurchased])
        }
        disabled={upgrade.cost > count}
        purchased={purchased}
        upgradeCost={upgrade.cost}
        text={upgrade.label}
      />
    );
  });

  const purchaseMarkup = useMemo(() => {
    return purchases.map((purchase) => {
      const { id, cost } = purchase;

      const purchased = purchasesPurchased.find((item) => item.id === id);
      const purchasedArray = [
        ...purchasesPurchased.filter((item) => item.id !== id),
      ];
      const totalOwned = (purchased && purchased.amount) || 0;

      const costIncrease = purchased
        ? Math.round((cost * Math.pow(1.18, purchased.amount) * 100) / 100)
        : cost;

      const callbackLogic = () => {
        if (purchased !== undefined) {
          purchasedArray.push({
            id: purchased.id,
            label: purchased.label,
            amount: purchased.amount + 1,
            power: purchased.power,
          });
          setPurchasesPurchased([...purchasedArray]);
        } else {
          setPurchasesPurchased([
            {
              id: id,
              amount: 1,
              power: purchase.power,
              label: purchase.label,
            },
            ...purchasesPurchased,
          ]);
        }
      };

      return totalCount > cost * 0.75 ? (
        <UpgradeButton
          key={id}
          callback={() => decreaseCount(costIncrease)}
          upgradeCallback={callbackLogic}
          disabled={count - costIncrease < 0}
          upgradeCost={costIncrease}
          text={`${purchase.label}: +${purchase.power} AC (${totalOwned}) `}
        />
      ) : null;
    });
  }, [purchasesPurchased, count, totalCount, decreaseCount]);

  const totalPower = useMemo(() => {
    return purchasesPurchased.reduce(
      (acc, cur) => acc + cur.amount * cur.power,
      0
    );
  }, [purchasesPurchased]);

  useEffect(() => {
    setDelta((delta) => {
      let _delta = delta;
      upgrades.forEach((upgrade) => {
        if (upgradesPurchased.includes(upgrade.id) && upgrade.clickPower) {
          _delta += upgrade.clickPower;
        }
      });
      return _delta;
    });
  }, [upgradesPurchased]);

  useEffect(() => {
    let delta = 0;
    purchasesPurchased.forEach(
      (purchase) => (delta += purchase.amount * purchase.power)
    );
    upgrades.forEach((upgrade) => {
      if (upgradesPurchased.indexOf(upgrade.id) !== -1 && upgrade.unitPower) {
        delta += delta * upgrade.unitPower;
      }
    });

    const interval = setInterval(() => {
      setTotalCount((totalCount) => totalCount + delta);
      setCount((count) => count + delta);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [upgradesPurchased, purchasesPurchased]);

  const up = () => {
    return (
      <>
        <TextItemContainer>Upgrades:</TextItemContainer>
        {upgradeMarkup}
      </>
    );
  };

  return (
    <div className="App">
      <br />
      <div>
        <ResetButtonStyled onClick={reset}>Reset</ResetButtonStyled>
      </div>
      <TextGeneralContainer>
        <TextItemContainer>
          Total Video Games: {Math.round(totalCount * 100) / 100}
        </TextItemContainer>
        <TextItemContainer className="count">
          $ Money {Math.round(count * 100) / 100} 💰
        </TextItemContainer>
        <br />
        <br />
        <div>+{Math.round(delta * 100) / 100} Manual/Click (M)</div>
        <div>+{Math.round(totalPower * 100) / 100} Auto Click/sec (AC)</div>

        <br />
        <br />
        <TextItemContainer>Workers:</TextItemContainer>
        {purchaseMarkup}

        <CountButton delta={delta} callback={() => increaseCount(delta)} />
        <br />
        {totalCount > 100 ? up() : ""}
      </TextGeneralContainer>
    </div>
  );
};

export default Home;
