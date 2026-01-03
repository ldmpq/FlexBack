import axiosClient from '../utils/axiosClient';
import type { Patient } from '../types/patient.type';

export const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    const res: any = await axiosClient.get('/users/benh-nhan');
    return res.data.data || res.data || [];
  },

  getMyPatients: async (): Promise<Patient[]> => {
    const res: any = await axiosClient.get('/benh-nhan/assigned'); 
    return res.data.data || []; //
  }
};