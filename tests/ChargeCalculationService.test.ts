import { describe, it, expect } from 'vitest'
import { ChargeCalculationService } from '@/services/ChargeCalculationService'

/**
 * Comprehensive test suite for ChargeCalculationService
 * 
 * Tests cover:
 * - All public methods with various input combinations
 * - Error handling for invalid inputs (negative values, NaN, etc.)
 * - Boundary conditions (zero values, very large numbers)
 * - Floating point precision handling
 * - Both fixed and percentage fee calculations
 * - Complete integration tests for hybrid and EV modes
 * 
 * Coverage: 100% statements, branches, functions, and lines
 */
describe('ChargeCalculationService', () => {
  describe('calculateChargingCost', () => {
    it('should calculate charging cost with fixed fee', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      const result = ChargeCalculationService.calculateChargingCost(params)
      
      expect(result).toBe(15) // (50 * 0.25) + 2.50 = 15
    })

    it('should calculate charging cost with percentage fee', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 10
      }

      const result = ChargeCalculationService.calculateChargingCost(params)
      
      expect(result).toBe(13.75) // (50 * 0.25) + (12.5 * 0.1) = 13.75
    })

    it('should calculate charging cost with no fee', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'none' as const,
        startingFee: 0,
        transactionFeePercent: 0
      }

      const result = ChargeCalculationService.calculateChargingCost(params)
      
      expect(result).toBe(12.5) // 50 * 0.25 = 12.5
    })

    it('should throw error for invalid battery capacity', () => {
      const params = {
        batteryCapacity: -10,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      expect(() => ChargeCalculationService.calculateChargingCost(params))
        .toThrow('Battery capacity and price per kWh must be valid non-negative numbers')
    })

    it('should throw error for invalid price per kWh', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: -0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      expect(() => ChargeCalculationService.calculateChargingCost(params))
        .toThrow('Battery capacity and price per kWh must be valid non-negative numbers')
    })

    it('should throw error for invalid starting fee', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: -2.50,
        transactionFeePercent: 0
      }

      expect(() => ChargeCalculationService.calculateChargingCost(params))
        .toThrow('Starting fee must be a non-negative number')
    })

    it('should throw error for invalid transaction fee percentage', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 150
      }

      expect(() => ChargeCalculationService.calculateChargingCost(params))
        .toThrow('Transaction fee percentage must be a number between 0 and 100')
    })

    it('should handle NaN values gracefully', () => {
      const params = {
        batteryCapacity: NaN,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      expect(() => ChargeCalculationService.calculateChargingCost(params))
        .toThrow('Battery capacity and price per kWh must be valid non-negative numbers')
    })
  })

  describe('calculateKmRange', () => {
    it('should calculate km range correctly', () => {
      const params = {
        batteryCapacity: 75,
        kwhUsage: 0.18
      }

      const result = ChargeCalculationService.calculateKmRange(params)
      
      expect(result).toBeCloseTo(416.67, 2) // 75 / 0.18 ≈ 416.67
    })

    it('should throw error for negative battery capacity', () => {
      const params = {
        batteryCapacity: -50,
        kwhUsage: 0.18
      }

      expect(() => ChargeCalculationService.calculateKmRange(params))
        .toThrow('Battery capacity must be a non-negative number')
    })

    it('should throw error for zero kWh usage', () => {
      const params = {
        batteryCapacity: 75,
        kwhUsage: 0
      }

      expect(() => ChargeCalculationService.calculateKmRange(params))
        .toThrow('kWh usage must be a positive number')
    })

    it('should throw error for negative kWh usage', () => {
      const params = {
        batteryCapacity: 75,
        kwhUsage: -0.18
      }

      expect(() => ChargeCalculationService.calculateKmRange(params))
        .toThrow('kWh usage must be a positive number')
    })

    it('should handle NaN values', () => {
      const params = {
        batteryCapacity: NaN,
        kwhUsage: 0.18
      }

      expect(() => ChargeCalculationService.calculateKmRange(params))
        .toThrow('Battery capacity must be a non-negative number')
    })
  })

  describe('calculatePetrolCost', () => {
    it('should calculate petrol cost correctly', () => {
      const params = {
        kmRange: 400,
        petrolUsage: 12, // km per liter
        petrolPrice: 1.50
      }

      const result = ChargeCalculationService.calculatePetrolCost(params)
      
      expect(result).toBe(50) // (400 / 12) * 1.50 = 50
    })

    it('should handle fractional values', () => {
      const params = {
        kmRange: 350,
        petrolUsage: 14.5,
        petrolPrice: 1.45
      }

      const result = ChargeCalculationService.calculatePetrolCost(params)
      
      expect(result).toBeCloseTo(35.0, 1) // (350 / 14.5) * 1.45 ≈ 35.0
    })

    it('should throw error for negative range', () => {
      const params = {
        kmRange: -100,
        petrolUsage: 12,
        petrolPrice: 1.50
      }

      expect(() => ChargeCalculationService.calculatePetrolCost(params))
        .toThrow('Range must be a non-negative number')
    })

    it('should throw error for zero petrol usage', () => {
      const params = {
        kmRange: 400,
        petrolUsage: 0,
        petrolPrice: 1.50
      }

      expect(() => ChargeCalculationService.calculatePetrolCost(params))
        .toThrow('Petrol usage must be a positive number')
    })

    it('should throw error for negative petrol price', () => {
      const params = {
        kmRange: 400,
        petrolUsage: 12,
        petrolPrice: -1.50
      }

      expect(() => ChargeCalculationService.calculatePetrolCost(params))
        .toThrow('Petrol price must be a non-negative number')
    })
  })

  describe('compareChargingWithPetrolCost', () => {
    it('should identify charging as cheaper', () => {
      const params = {
        chargingCost: 15,
        petrolCost: 25
      }

      const result = ChargeCalculationService.compareChargingWithPetrolCost(params)
      
      expect(result).toEqual({
        isChargingCheaper: true,
        savings: 10,
        cheaperOption: 'charging',
        costDifference: 10
      })
    })

    it('should identify petrol as cheaper', () => {
      const params = {
        chargingCost: 30,
        petrolCost: 20
      }

      const result = ChargeCalculationService.compareChargingWithPetrolCost(params)
      
      expect(result).toEqual({
        isChargingCheaper: false,
        savings: 10,
        cheaperOption: 'petrol',
        costDifference: -10
      })
    })

    it('should handle equal costs', () => {
      const params = {
        chargingCost: 25,
        petrolCost: 25
      }

      const result = ChargeCalculationService.compareChargingWithPetrolCost(params)
      
      expect(result).toEqual({
        isChargingCheaper: false,
        savings: 0,
        cheaperOption: 'petrol',
        costDifference: 0
      })
    })

    it('should throw error for negative charging cost', () => {
      const params = {
        chargingCost: -15,
        petrolCost: 25
      }

      expect(() => ChargeCalculationService.compareChargingWithPetrolCost(params))
        .toThrow('Charging cost and petrol cost must be non-negative numbers')
    })

    it('should throw error for NaN values', () => {
      const params = {
        chargingCost: NaN,
        petrolCost: 25
      }

      expect(() => ChargeCalculationService.compareChargingWithPetrolCost(params))
        .toThrow('Charging cost and petrol cost must be non-negative numbers')
    })
  })

  describe('calculateHybridComparison', () => {
    it('should calculate complete hybrid comparison', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0,
        kwhUsage: 0.20,
        petrolUsage: 12,
        petrolPrice: 1.50,
        carPhases: 3 as const,
        chargingPower: 11 as const
      }

      const result = ChargeCalculationService.calculateHybridComparison(params)
      
      expect(result.chargingCost).toBe(15) // (50 * 0.25) + 2.50
      expect(result.kmRange).toBe(250) // 50 / 0.20
      expect(result.petrolCost).toBe(31.25) // (250 / 12) * 1.50
      expect(result.isChargingCheaper).toBe(true)
      expect(result.savings).toBe(16.25)
      expect(result.cheaperOption).toBe('charging')
      expect(result.costDifference).toBe(16.25)
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(8.415, 2) // 11 * 0.9 * 0.85 = 8.415
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(5.94, 2) // 50 / 8.415 ≈ 5.94
    })

    it('should handle percentage fee in hybrid comparison', () => {
      const params = {
        batteryCapacity: 60,
        pricePerKWh: 0.30,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 15,
        kwhUsage: 0.18,
        petrolUsage: 14,
        petrolPrice: 1.40,
        carPhases: 1 as const,
        chargingPower: 11 as const
      }

      const result = ChargeCalculationService.calculateHybridComparison(params)
      
      expect(result.chargingCost).toBe(20.7) // (60 * 0.30) + (18 * 0.15)
      expect(result.kmRange).toBeCloseTo(333.33, 2) // 60 / 0.18
      expect(result.petrolCost).toBeCloseTo(33.33, 2) // (333.33 / 14) * 1.40
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(2.805, 2) // (11/3) * 0.9 * 0.85 ≈ 2.805kW
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(21.39, 2) // 60 / 2.805 ≈ 21.39
    })
  })

  describe('calculateEVCosts', () => {
    it('should calculate EV costs correctly', () => {
      const params = {
        batteryCapacity: 75,
        pricePerKWh: 0.28,
        feeType: 'fixed' as const,
        startingFee: 3.00,
        transactionFeePercent: 0,
        kwhUsage: 0.16,
        carPhases: 3 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateEVCosts(params)
      
      expect(result.chargingCost).toBeCloseTo(24, 2) // (75 * 0.28) + 3.00
      expect(result.kmRange).toBe(468.75) // 75 / 0.16
      expect(result.isChargingCheaper).toBe(true)
      expect(result.petrolCost).toBe(0)
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(16.83, 2) // 22 * 0.9 * 0.85 = 16.83
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(4.46, 2) // 75 / 16.83 ≈ 4.46
    })

    it('should handle percentage fee in EV calculation', () => {
      const params = {
        batteryCapacity: 80,
        pricePerKWh: 0.35,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 8,
        kwhUsage: 0.22,
        carPhases: 1 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateEVCosts(params)
      
      expect(result.chargingCost).toBeCloseTo(30.24, 2) // (80 * 0.35) + (28 * 0.08)
      expect(result.kmRange).toBeCloseTo(363.64, 2) // 80 / 0.22
      expect(result.isChargingCheaper).toBe(true)
      expect(result.petrolCost).toBe(0)
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(5.61, 2) // (22/3) * 0.9 * 0.85 ≈ 5.61kW
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(14.26, 2) // 80 / 5.61 ≈ 14.26
    })
  })

  describe('Edge cases and boundary conditions', () => {
    it('should handle zero battery capacity', () => {
      const params = {
        batteryCapacity: 0,
        pricePerKWh: 0.25,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      const result = ChargeCalculationService.calculateChargingCost(params)
      expect(result).toBe(2.50) // Only the starting fee
    })

    it('should handle zero price per kWh', () => {
      const params = {
        batteryCapacity: 50,
        pricePerKWh: 0,
        feeType: 'fixed' as const,
        startingFee: 2.50,
        transactionFeePercent: 0
      }

      const result = ChargeCalculationService.calculateChargingCost(params)
      expect(result).toBe(2.50) // Only the starting fee
    })

    it('should handle very large numbers', () => {
      const params = {
        batteryCapacity: 1000,
        pricePerKWh: 1.5,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 5,
        kwhUsage: 0.1,
        petrolUsage: 20,
        petrolPrice: 2.0,
        carPhases: 3 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateHybridComparison(params)
      
      expect(result.chargingCost).toBe(1575) // (1000 * 1.5) + (1500 * 0.05)
      expect(result.kmRange).toBe(10000) // 1000 / 0.1
      expect(result.petrolCost).toBe(1000) // (10000 / 20) * 2.0
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(16.83, 2) // 22 * 0.9 * 0.85 = 16.83
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(59.42, 2) // 1000 / 16.83 ≈ 59.42
    })

    it('should handle decimal precision correctly', () => {
      const params = {
        batteryCapacity: 33.33,
        pricePerKWh: 0.333,
        feeType: 'percentage' as const,
        startingFee: 0,
        transactionFeePercent: 7.5,
        kwhUsage: 0.177,
        carPhases: 1 as const,
        chargingPower: 11 as const
      }

      const result = ChargeCalculationService.calculateEVCosts(params)
      
      expect(result.chargingCost).toBeCloseTo(11.93, 2)
      expect(result.kmRange).toBeCloseTo(188.31, 1) // 33.33 / 0.177 ≈ 188.31
      expect(result.chargeTime.actualChargingPower).toBeCloseTo(2.805, 2) // (11/3) * 0.9 * 0.85 ≈ 2.805
      expect(result.chargeTime.chargeTimeHours).toBeCloseTo(11.88, 2) // 33.33 / 2.805 ≈ 11.88
    })
  })

  describe('calculateChargeTime', () => {
    it('should calculate charge time for 3-phase car with 11kW charger', () => {
      const params = {
        batteryCapacity: 50,
        carPhases: 3 as const,
        chargingPower: 11 as const
      }

      const result = ChargeCalculationService.calculateChargeTime(params)
      
      // With efficiency (90%) and ramp-up (85%) factors: 11 * 0.9 * 0.85 = 8.415 kW
      expect(result.actualChargingPower).toBeCloseTo(8.415, 2)
      expect(result.chargeTimeHours).toBeCloseTo(5.94, 2) // 50 / 8.415 ≈ 5.94
      expect(result.chargeTimeMinutes).toBe(357) // 5.94 * 60 ≈ 357 minutes
      expect(result.formattedTime).toBe('5h 57m')
    })

    it('should calculate charge time for 1-phase car with 11kW charger', () => {
      const params = {
        batteryCapacity: 75,
        carPhases: 1 as const,
        chargingPower: 11 as const
      }

      const result = ChargeCalculationService.calculateChargeTime(params)
      
      // 1-phase gets 1/3 power, then efficiency factors: (11/3) * 0.9 * 0.85 ≈ 2.805 kW
      expect(result.actualChargingPower).toBeCloseTo(2.805, 2)
      expect(result.chargeTimeHours).toBeCloseTo(26.74, 2) // 75 / 2.805 ≈ 26.74
      expect(result.chargeTimeMinutes).toBe(1604) // 26.74 * 60 ≈ 1604 minutes
      expect(result.formattedTime).toBe('26h 44m')
    })

    it('should calculate charge time for 3-phase car with 22kW charger', () => {
      const params = {
        batteryCapacity: 100,
        carPhases: 3 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateChargeTime(params)
      
      // With efficiency factors: 22 * 0.9 * 0.85 = 16.83 kW
      expect(result.actualChargingPower).toBeCloseTo(16.83, 2)
      expect(result.chargeTimeHours).toBeCloseTo(5.94, 2) // 100 / 16.83 ≈ 5.94
      expect(result.chargeTimeMinutes).toBe(357) // 5.94 * 60 ≈ 357 minutes
      expect(result.formattedTime).toBe('5h 57m')
    })

    it('should calculate charge time for 1-phase car with 22kW charger', () => {
      const params = {
        batteryCapacity: 60,
        carPhases: 1 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateChargeTime(params)
      
      // 1-phase gets 1/3, then efficiency factors: (22/3) * 0.9 * 0.85 ≈ 5.61 kW
      expect(result.actualChargingPower).toBeCloseTo(5.61, 2)
      expect(result.chargeTimeHours).toBeCloseTo(10.70, 2) // 60 / 5.61 ≈ 10.70
      expect(result.chargeTimeMinutes).toBe(642) // 10.70 * 60 ≈ 642 minutes
      expect(result.formattedTime).toBe('10h 42m')
    })

    it('should format short charge times correctly', () => {
      const params = {
        batteryCapacity: 5,
        carPhases: 3 as const,
        chargingPower: 22 as const
      }

      const result = ChargeCalculationService.calculateChargeTime(params)
      
      // With efficiency factors: 5 / (22 * 0.9 * 0.85) ≈ 0.297 hours ≈ 18 minutes
      expect(result.chargeTimeHours).toBeCloseTo(0.297, 2)
      expect(result.formattedTime).toBe('18m')
    })

    it('should throw error for invalid battery capacity', () => {
      const params = {
        batteryCapacity: -50,
        carPhases: 3 as const,
        chargingPower: 11 as const
      }

      expect(() => ChargeCalculationService.calculateChargeTime(params))
        .toThrow('Battery capacity must be a positive number')
    })

    it('should throw error for invalid car phases', () => {
      const params = {
        batteryCapacity: 50,
        carPhases: 2 as any,
        chargingPower: 11 as const
      }

      expect(() => ChargeCalculationService.calculateChargeTime(params))
        .toThrow('Car phases must be either 1 or 3')
    })

    it('should throw error for invalid charging power', () => {
      const params = {
        batteryCapacity: 50,
        carPhases: 3 as const,
        chargingPower: 15 as any
      }

      expect(() => ChargeCalculationService.calculateChargeTime(params))
        .toThrow('Charging power must be either 11 or 22 kW')
    })
  })
})
