/**
 * Service class for handling all charging and cost calculations
 */

export type FeeType = 'fixed' | 'percentage' | 'none';

export interface ChargingCostParams {
  batteryCapacity: number;
  pricePerKWh: number;
  feeType: FeeType;
  startingFee: number;
  transactionFeePercent: number;
}

export interface ChargeTimeParams {
  batteryCapacity: number;
  carPhases: 1 | 3;
  chargingPower: 11 | 22;
}

export interface ChargeTimeResult {
  chargeTimeHours: number;
  chargeTimeMinutes: number;
  actualChargingPower: number;
  formattedTime: string;
}

export interface RangeParams {
  batteryCapacity: number;
  kwhUsage: number;
}

export interface PetrolCostParams {
  kmRange: number;
  petrolUsage: number;
  petrolPrice: number;
}

export interface ComparisonParams {
  chargingCost: number;
  petrolCost: number;
}

export interface ComparisonResult {
  isChargingCheaper: boolean;
  savings: number;
  cheaperOption: 'charging' | 'petrol';
  costDifference: number;
}

export interface HybridComparisonParams {
  batteryCapacity: number;
  pricePerKWh: number;
  feeType: FeeType;
  startingFee: number;
  transactionFeePercent: number;
  kwhUsage: number;
  petrolUsage: number;
  petrolPrice: number;
  carPhases: 1 | 3;
  chargingPower: 11 | 22;
}

export interface HybridComparisonResult extends ComparisonResult {
  chargingCost: number;
  petrolCost: number;
  kmRange: number;
  chargeTime: ChargeTimeResult;
}

export interface EVCostsParams {
  batteryCapacity: number;
  pricePerKWh: number;
  feeType: FeeType;
  startingFee: number;
  transactionFeePercent: number;
  kwhUsage: number;
  carPhases: 1 | 3;
  chargingPower: 11 | 22;
}

export interface EVCostsResult {
  chargingCost: number;
  kmRange: number;
  isChargingCheaper: boolean;
  petrolCost: number;
  chargeTime: ChargeTimeResult;
}

export class ChargeCalculationService {
  /**
   * Calculate the total charging cost
   */
  static calculateChargingCost({
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent
  }: ChargingCostParams): number {
    if (isNaN(batteryCapacity) || isNaN(pricePerKWh) || batteryCapacity < 0 || pricePerKWh < 0) {
      throw new Error('Battery capacity and price per kWh must be valid non-negative numbers')
    }

    if (feeType === 'fixed' && (isNaN(startingFee) || startingFee < 0)) {
      throw new Error('Starting fee must be a non-negative number')
    }

    if (feeType === 'percentage' && (isNaN(transactionFeePercent) || transactionFeePercent < 0 || transactionFeePercent > 100)) {
      throw new Error('Transaction fee percentage must be a number between 0 and 100')
    }

    const energyCost = batteryCapacity * pricePerKWh
    
    let fee = 0
    if (feeType === 'fixed') {
      fee = startingFee
    } else if (feeType === 'percentage') {
      fee = energyCost * transactionFeePercent / 100
    }

    return energyCost + fee
  }

  /**
   * Calculate the estimated range in kilometers
   */
  static calculateKmRange({ batteryCapacity, kwhUsage }: RangeParams): number {
    if (isNaN(batteryCapacity) || batteryCapacity < 0) {
      throw new Error('Battery capacity must be a non-negative number')
    }

    if (isNaN(kwhUsage) || kwhUsage <= 0) {
      throw new Error('kWh usage must be a positive number')
    }

    return batteryCapacity / kwhUsage
  }

  /**
   * Calculate the equivalent petrol cost for the same range
   */
  static calculatePetrolCost({ kmRange, petrolUsage, petrolPrice }: PetrolCostParams): number {
    if (isNaN(kmRange) || kmRange < 0) {
      throw new Error('Range must be a non-negative number')
    }

    if (isNaN(petrolUsage) || petrolUsage <= 0) {
      throw new Error('Petrol usage must be a positive number')
    }

    if (isNaN(petrolPrice) || petrolPrice < 0) {
      throw new Error('Petrol price must be a non-negative number')
    }

    return (kmRange / petrolUsage) * petrolPrice
  }

  /**
   * Compare charging cost with petrol cost
   */
  static compareChargingWithPetrolCost({ chargingCost, petrolCost }: ComparisonParams): ComparisonResult {
    if (isNaN(chargingCost) || isNaN(petrolCost) || chargingCost < 0 || petrolCost < 0) {
      throw new Error('Charging cost and petrol cost must be non-negative numbers')
    }

    const isChargingCheaper = chargingCost < petrolCost
    const savings = Math.abs(chargingCost - petrolCost)

    return {
      isChargingCheaper,
      savings,
      cheaperOption: isChargingCheaper ? 'charging' : 'petrol',
      costDifference: petrolCost - chargingCost
    }
  }

  /**
   * Calculate charge time based on battery capacity, car phases, and charging power
   * Includes realistic factors like efficiency margin and power ramp-up behavior
   */
  static calculateChargeTime({ batteryCapacity, carPhases, chargingPower }: ChargeTimeParams): ChargeTimeResult {
    if (isNaN(batteryCapacity) || batteryCapacity <= 0) {
      throw new Error('Battery capacity must be a positive number')
    }

    if (carPhases !== 1 && carPhases !== 3) {
      throw new Error('Car phases must be either 1 or 3')
    }

    if (chargingPower !== 11 && chargingPower !== 22) {
      throw new Error('Charging power must be either 11 or 22 kW')
    }

    // Calculate theoretical maximum charging power
    // For 1-phase cars, they only use 1/3 of the available power for 11kW stations
    // For 22kW stations, 1-phase cars still only get about 7.4kW (1/3 of 22kW)
    let theoreticalMaxPower: number;
    
    if (carPhases === 1) {
      // 1-phase car uses 1/3 of the total power
      theoreticalMaxPower = chargingPower / 3;
    } else {
      // 3-phase car can use full power
      theoreticalMaxPower = chargingPower;
    }

    // Apply realistic efficiency factors:
    // 1. Charging efficiency margin (cars never achieve 100% of rated power continuously)
    const efficiencyFactor = 0.90; // 90% efficiency accounting for heat, losses, etc.
    
    // 2. Power ramp-up factor (cars gradually increase power draw)
    // The car starts at lower power and ramps up, so average power is lower than max
    const rampUpFactor = 0.90; // 90% to account for gradual power ramp-up
    
    // Calculate realistic average charging power
    const actualChargingPower = theoreticalMaxPower * efficiencyFactor * rampUpFactor;

    // Calculate charge time in hours
    const chargeTimeHours = batteryCapacity / actualChargingPower;
    
    // Convert to hours and minutes
    const hours = Math.floor(chargeTimeHours);
    const minutes = Math.round((chargeTimeHours - hours) * 60);
    
    // Format time string
    const formattedTime = hours > 0 
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

    return {
      chargeTimeHours,
      chargeTimeMinutes: hours * 60 + minutes,
      actualChargingPower,
      formattedTime
    };
  }

  /**
   * Calculate all costs for hybrid mode
   */
  static calculateHybridComparison({
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent,
    kwhUsage,
    petrolUsage,
    petrolPrice,
    carPhases,
    chargingPower
  }: HybridComparisonParams): HybridComparisonResult {
    const chargingCost = this.calculateChargingCost({
      batteryCapacity,
      pricePerKWh,
      feeType,
      startingFee,
      transactionFeePercent
    })

    const kmRange = this.calculateKmRange({ batteryCapacity, kwhUsage })

    const petrolCost = this.calculatePetrolCost({
      kmRange,
      petrolUsage,
      petrolPrice
    })

    const chargeTime = this.calculateChargeTime({
      batteryCapacity,
      carPhases,
      chargingPower
    })

    const comparison = this.compareChargingWithPetrolCost({
      chargingCost,
      petrolCost
    })

    return {
      chargingCost,
      petrolCost,
      kmRange,
      chargeTime,
      ...comparison
    }
  }

  /**
   * Calculate all costs for EV mode
   */
  static calculateEVCosts({
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent,
    kwhUsage,
    carPhases,
    chargingPower
  }: EVCostsParams): EVCostsResult {
    const chargingCost = this.calculateChargingCost({
      batteryCapacity,
      pricePerKWh,
      feeType,
      startingFee,
      transactionFeePercent
    })

    const kmRange = this.calculateKmRange({ batteryCapacity, kwhUsage })

    const chargeTime = this.calculateChargeTime({
      batteryCapacity,
      carPhases,
      chargingPower
    })

    return {
      chargingCost,
      kmRange,
      isChargingCheaper: true, // Always true for EV mode
      petrolCost: 0, // No petrol cost in EV mode
      chargeTime
    }
  }
}
