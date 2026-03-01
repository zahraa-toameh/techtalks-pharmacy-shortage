// src/types/medication.ts

export type AvailabilityStatus = 'available' | 'low' | 'out';
export type FilterType = 'all' | AvailabilityStatus;

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  format: string;
  price: number;
  availability: AvailabilityStatus;
  nearbyPharmacies: number;
  distance: string;
  stock: number;
  rating: number;
  region: string;
  description: string;
}

export const MEDICATIONS: Medication[] = [
  {
    id: 1,
    name: 'Amoxicillin',
    dosage: '500mg',
    format: 'Capsules',
    price: 12.99,
    availability: 'available',
    nearbyPharmacies: 8,
    distance: '2.5 km',
    stock: 156,
    rating: 4.8,
    region: 'Central',
    description: 'Antibiotic for bacterial infections',
  },
  {
    id: 2,
    name: 'Metformin',
    dosage: '1000mg',
    format: 'Tablets',
    price: 8.50,
    availability: 'available',
    nearbyPharmacies: 12,
    distance: '1.2 km',
    stock: 245,
    rating: 4.9,
    region: 'Central',
    description: 'Diabetes management medication',
  },
  {
    id: 3,
    name: 'Lisinopril',
    dosage: '10mg',
    format: 'Tablets',
    price: 15.99,
    availability: 'low',
    nearbyPharmacies: 3,
    distance: '5.8 km',
    stock: 28,
    rating: 4.7,
    region: 'North',
    description: 'Blood pressure management',
  },
  {
    id: 4,
    name: 'Albuterol',
    dosage: '100mcg',
    format: 'Inhaler',
    price: 45.00,
    availability: 'available',
    nearbyPharmacies: 5,
    distance: '3.2 km',
    stock: 89,
    rating: 4.6,
    region: 'Central',
    description: 'Asthma and COPD relief',
  },
  {
    id: 5,
    name: 'Aspirin',
    dosage: '500mg',
    format: 'Tablets',
    price: 3.99,
    availability: 'out',
    nearbyPharmacies: 2,
    distance: '7.1 km',
    stock: 0,
    rating: 4.9,
    region: 'South',
    description: 'Pain relief and fever reduction',
  },
  {
    id: 6,
    name: 'Omeprazole',
    dosage: '20mg',
    format: 'Capsules',
    price: 9.99,
    availability: 'available',
    nearbyPharmacies: 10,
    distance: '1.8 km',
    stock: 167,
    rating: 4.8,
    region: 'Central',
    description: 'Acid reflux and GERD treatment',
  },
];