// src/utils/fileManager.ts
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { PlannerData } from '../types/types';

export const exportData = async (data: PlannerData) => {
  const fileName = 'daily-planner-backup.json';
  const fileContent = JSON.stringify(data, null, 2);

  try {
    if (Platform.OS === 'web') {
      // For web, create a Blob and trigger a download link.
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a); // Append link to the body
      a.click(); // Programmatically click the link to trigger the download
      document.body.removeChild(a); // Clean up by removing the link
      URL.revokeObjectURL(url); // Release the object URL
    } else {
      // For native (iOS/Android), write to a file and use the sharing API.
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, fileContent);
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export your planner data',
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data.');
  }
};

export const importData = async (): Promise<PlannerData | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;

      let fileContent: string;

      if (Platform.OS === 'web') {
        // Web: fetch the file as text
        const response = await fetch(fileUri);
        fileContent = await response.text();
      } else {
        // Native: use FileSystem
        fileContent = await FileSystem.readAsStringAsync(fileUri);
      }

      console.log('Imported file content:', fileContent);
      try {
        const parsed = JSON.parse(fileContent);
        console.log('Parsed JSON:', parsed);
        return parsed;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        alert('Failed to parse imported JSON. See console for details.');
        return null;
      }
    } else {
      console.warn('No file selected or file selection canceled.');
    }
  } catch (error) {
    console.error('Error importing data:', error);
    alert('Failed to import data.');
  }
  return null;
};