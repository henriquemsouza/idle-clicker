export interface UpgradeButtonProps {
  upgradeCost: number
  text: string
  callback: (delta: number) => void
  disabled?: boolean
  purchased?: boolean
  upgradeCallback: () => void
}
