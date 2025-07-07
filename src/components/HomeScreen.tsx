// src/components/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import { loadData, saveData } from '../utils/storage';
import { exportData, importData } from '../utils/fileManager';
import { PlannerData } from '../types/types';

type RootStackParamList = {
  Home: undefined;
  Day: { date: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [data, setData] = useState<PlannerData>({});
  const [dates, setDates] = useState<string[]>([]);

  const loadPlannerData = async () => {
    const loadedData = await loadData();
    setData(loadedData);
    const sortedDates = Object.keys(loadedData).sort((a, b) => moment(b).diff(moment(a)));
    const today = moment().format('YYYY-MM-DD');
    if (!loadedData[today]) {
        if (!sortedDates.includes(today)) {
            sortedDates.unshift(today);
        }
    }
    setDates(sortedDates);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlannerData();
    }, [])
  );

  const handleExport = async () => {
    await exportData(data);
  };

  const handleImport = async () => {
  const importedData = await importData();
  if (importedData) {
    if (Platform.OS === 'web') {
      // Use browser confirm dialog on web
      const confirmed = window.confirm('This will overwrite your current data. Are you sure?');
      if (confirmed) {
        await saveData(importedData);
        loadPlannerData();
      }
    } else {
      // Use native Alert on mobile
      Alert.alert(
        'Confirm Import',
        'This will overwrite your current data. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: async () => {
              await saveData(importedData);
              loadPlannerData();
            },
          },
        ]
      );
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Import Data" onPress={handleImport} />
        <Button title="Export Data" onPress={handleExport} />
      </View>
      <FlatList
        data={dates}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dateItem}
            onPress={() => navigation.navigate('Day', { date: item })}
          >
            <Text style={styles.dateText}>{moment(item).format('MMMM D, YYYY')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dateItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 2,
  },
  dateText: {
    fontSize: 18,
  },
});

export default HomeScreen;