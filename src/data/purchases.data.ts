type TPurchase = {
    cost: number
    id: string
    label: string
    power: number
  }
  
  export const purchases: TPurchase[] = [
    {
      id: "developer",
      cost: 15,
      label: "Developer",
      power: 1,
    },
    {
      id: "designer",
      cost: 76,
      label: "Designer",
      power: 3,
    },
  ]
  