import React from "react"
import { CountButtonStyled } from "./styled/count-button.styled"

interface IProps {
  delta: number
  callback: () => void
  disabled?: boolean
}

export const CountButton: React.FC<IProps> = ({
  delta,
  callback,
  disabled = false,
}) => {
  //   +{Math.round((delta + Number.EPSILON) * 100) / 100}
  return (
    <CountButtonStyled onClick={callback} disabled={disabled}>
      +{Math.round((delta + Number.EPSILON) * 100) / 100}
    </CountButtonStyled>
  )
}
