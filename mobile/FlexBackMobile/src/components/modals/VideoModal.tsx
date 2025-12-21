import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

const SERVER_URL = 'http://10.0.2.2:3000'; 

interface VideoModalProps {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ visible, videoUrl, onClose }) => {
  // Xử lý URL
  let fullUrl = videoUrl || '';
  if (fullUrl && !fullUrl.startsWith('http')) {
    const cleanPath = fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
    fullUrl = `${SERVER_URL}${cleanPath}`;
  }

  // Tạo player instance
  const player = useVideoPlayer(fullUrl, player => {
    player.loop = false;
    player.play(); // Tự động phát khi mở modal
  });

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          {fullUrl ? (
            <View style={styles.videoWrapper}>
              <VideoView 
                style={styles.video} 
                player={player} 
                fullscreenOptions={{enable: true}}
                allowsPictureInPicture 
              />
            </View>
          ) : (
            <View style={styles.errorContainer}>
               <Text style={{color:'white'}}>Không có video</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center' },
  modalView: { width: '100%', height: 300, justifyContent: 'center' }, // Chỉnh chiều cao cố định
  closeButton: { position: 'absolute', top: -50, right: 20, zIndex: 10, padding: 10 },
  videoWrapper: { width: '100%', height: '100%', backgroundColor: 'black' },
  video: { width: '100%', height: '100%' },
  errorContainer: { alignItems: 'center' }
});

export default VideoModal;


