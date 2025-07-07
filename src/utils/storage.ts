// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlannerData } from '../types/types';

const STORAGE_KEY = 'dailyPlannerData';

export const saveData = async (data: PlannerData) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save data.', e);
  }
};

export const loadData = async (): Promise<PlannerData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Failed to load data.', e);
    return {};
  }
};