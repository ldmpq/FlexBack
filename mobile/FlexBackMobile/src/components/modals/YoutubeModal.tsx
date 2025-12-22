import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

interface YoutubeModalProps {
  visible: boolean;
  youtubeUrl: string | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const YoutubeModal: React.FC<YoutubeModalProps> = ({
  visible,
  youtubeUrl,
  onClose,
}) => {
  if (!youtubeUrl) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <WebView
          source={{ uri: youtubeUrl }}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </Modal>
  );
};

export default YoutubeModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});