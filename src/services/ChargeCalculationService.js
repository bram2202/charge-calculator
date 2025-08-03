/**
 * Service class for handling all charging and cost calculations
 */
export class ChargeCalculationService {
  /**
   * Calculate the total charging cost
   * @param {Object} params - Calculation parameters
   * @param {number} params.batteryCapacity - Battery capacity in kWh
   * @param {number} params.pricePerKWh - Price per kWh in euros
   * @param {string} params.feeType - Fee type ('fixed' or 'percentage')
   * @param {number} params.startingFee - Starting fee in euros (when feeType is 'fixed')
   * @param {number} params.transactionFeePercent - Transaction fee percentage (when feeType is 'percentage')
   * @returns {number} Total charging cost in euros
   */
  static calculateChargingCost({
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent
  }) {
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
   * @param {Object} params - Calculation parameters
   * @param {number} params.batteryCapacity - Battery capacity in kWh
   * @param {number} params.kwhUsage - Energy usage in kWh per km
   * @returns {number} Estimated range in kilometers
   */
  static calculateKmRange({ batteryCapacity, kwhUsage }) {
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
   * @param {Object} params - Calculation parameters
   * @param {number} params.kmRange - Range in kilometers
   * @param {number} params.petrolUsage - Petrol usage in km per liter
   * @param {number} params.petrolPrice - Petrol price in euros per liter
   * @returns {number} Petrol cost in euros
   */
  static calculatePetrolCost({ kmRange, petrolUsage, petrolPrice }) {
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
   * @param {Object} params - Calculation parameters
   * @param {number} params.chargingCost - Charging cost in euros
   * @param {number} params.petrolCost - Petrol cost in euros
   * @returns {Object} Comparison result with isChargingCheaper and savings
   */
  static compareChargingWithPetrolCost({ chargingCost, petrolCost }) {
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
   * @param {Object} params - All calculation parameters
   * @returns {Object} Complete calculation results
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
  }) {
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
   * @param {Object} params - All calculation parameters
   * @returns {Object} Complete calculation results
   */
  static calculateEVCosts({
    batteryCapacity,
    pricePerKWh,
    feeType,
    startingFee,
    transactionFeePercent,
    kwhUsage
  }) {
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
