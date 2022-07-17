import { CountButtonProps } from "../../interfaces/count-button.interface";
import { CountButtonStyled } from "./count-button.styled";

const CountButton = ({
  delta,
  callback,
  disabled = false,
}: CountButtonProps) => {
  return (
    <CountButtonStyled onClick={callback} disabled={disabled}>
      +{Math.round((delta + Number.EPSILON) * 100) / 100}
    </CountButtonStyled>
  );
};

export default CountButton;
