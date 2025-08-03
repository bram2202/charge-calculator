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
}

export interface HybridComparisonResult extends ComparisonResult {
  chargingCost: number;
  petrolCost: number;
  kmRange: number;
}

export interface EVCostsParams {
  batteryCapacity: number;
  pricePerKWh: number;
  feeType: FeeType;
  startingFee: number;
  transactionFeePercent: number;
  kwhUsage: number;
}

export interface EVCostsResult {
  chargingCost: number;
  kmRange: number;
  isChargingCheaper: boolean;
  petrolCost: number;
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
    petrolPrice
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

    const comparison = this.compareChargingWithPetrolCost({
      chargingCost,
      petrolCost
    })

    return {
      chargingCost,
      petrolCost,
      kmRange,
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
    kwhUsage
  }: EVCostsParams): EVCostsResult {
    const chargingCost = this.calculateChargingCost({
      batteryCapacity,
      pricePerKWh,
      feeType,
      startingFee,
      transactionFeePercent
    })

    const kmRange = this.calculateKmRange({ batteryCapacity, kwhUsage })

    return {
      chargingCost,
      kmRange,
      isChargingCheaper: true, // Always true for EV mode
      petrolCost: 0 // No petrol cost in EV mode
    }
  }
}
