// src/components/DayScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { loadData, saveData } from '../utils/storage';
import { RowData, PlannerData, DayData } from '../types/types';

type RootStackParamList = {
  Home: undefined;
  Day: { date: string };
};

type DayScreenRouteProp = RouteProp<RootStackParamList, 'Day'>;

const DayScreen = () => {
  const route = useRoute<DayScreenRouteProp>();
  const { date } = route.params;
  const [dayData, setDayData] = useState<DayData>({ date, rows: [] });

  useEffect(() => {
    const loadDay = async () => {
      const allData = await loadData();
      if (allData[date]) {
        setDayData(allData[date]);
      }
    };
    loadDay();
  }, [date]);

  const handleSave = async () => {
    const allData = await loadData();
    const updatedData: PlannerData = {
      ...allData,
      [date]: dayData,
    };
    await saveData(updatedData);
    Alert.alert('Saved!', 'Your changes have been saved.');
  };

  const addRow = () => {
    const newRow: RowData = {
      id: Date.now().toString(),
      hourRange: '09:00 - 10:00',
      text: '',
    };
    setDayData({ ...dayData, rows: [...dayData.rows, newRow] });
  };

  const updateRow = (id: string, field: keyof RowData, value: string) => {
    const updatedRows = dayData.rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setDayData({ ...dayData, rows: updatedRows });
  };

    const deleteRow = (id: string) => {
    const updatedRows = dayData.rows.filter((row) => row.id !== id);
    setDayData({ ...dayData, rows: updatedRows });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{moment(date).format('MMMM D, YYYY')}</Text>
      <FlatList
        data={dayData.rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowContainer}>
            <TextInput
              style={styles.hourInput}
              value={item.hourRange}
              onChangeText={(text) => updateRow(item.id, 'hourRange', text)}
            />
            <TextInput
              style={styles.textInput}
              multiline
              value={item.text}
              onChangeText={(text) => updateRow(item.id, 'text', text)}
            />
             <TouchableOpacity onPress={() => deleteRow(item.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.buttonGroup}>
         <Button title="Add Row" onPress={addRow} />
         <Button title="Save Day" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dateHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  hourInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: 120,
    marginRight: 10,
    borderRadius: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
    minHeight: 50,
    borderRadius: 5,
  },
   deleteButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default DayScreen;