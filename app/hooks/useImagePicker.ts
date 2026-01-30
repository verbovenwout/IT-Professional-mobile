import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const pickImage = async (): Promise<string | null> => {
    try {
      // Permissie vragen
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we hebben permissie nodig om foto\'s te selecteren');
        return null;
      }

      // Foto selecteren
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we hebben cameratoegang nodig');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  return { pickImage, takePhoto };
};