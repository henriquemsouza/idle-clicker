import { UpgradeButtonProps } from "../interfaces/upgrade-button.interface";
import { GenericButtonStyled } from "./styled/generic-button.styled";
import { TextItemContainer } from "./styled/text-item-container.styled";

const UpgradeButton = ({
  upgradeCost,
  text,
  callback,
  upgradeCallback,
  disabled = false,
  purchased = false,
}: UpgradeButtonProps) => {

  const buyText = purchased ? "Bought" : `-${upgradeCost}`;

  return (
    <TextItemContainer>
      {text}
      <GenericButtonStyled
        disabled={disabled}
        onClick={() => {
          callback(upgradeCost);
          upgradeCallback();
        }}
      >
        {buyText}
      </GenericButtonStyled>
    </TextItemContainer>
  );
};

export default UpgradeButton;
