import React from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Platform,KeyboardAvoidingView,ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useChangePassword } from '../hooks/useChangePassword';
import HeaderNavigation from '../components/navigation/header.navigation';

const ChangePasswordScreen = ({ navigation }: any) => {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    showCurrent,
    showNew,
    showConfirm,
    setShowCurrent,
    setShowNew,
    setShowConfirm,
    loading,
    handleChangePassword,
  } = useChangePassword(() => navigation.goBack());

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} >
        {/* Header */}
        <HeaderNavigation title="Đổi mật khẩu" onBack={() => navigation.goBack()}/>

        <View style={styles.content}>
          {/* Mật khẩu hiện tại */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu hiện tại</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={18} color="#666" />
              <TextInput
                placeholder='******'
                style={styles.input}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Feather
                  name={showCurrent ? 'eye' : 'eye-off'}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Mật khẩu mới */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Feather name="key" size={18} color="#666" />
              <TextInput
                placeholder='******'
                style={styles.input}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Feather
                  name={showNew ? 'eye' : 'eye-off'}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Xác nhận */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Feather name="check-circle" size={18} color="#666" />
              <TextInput
                placeholder='******'
                style={styles.input}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Feather
                  name={showConfirm ? 'eye' : 'eye-off'}
                  size={18}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Xác nhận thay đổi</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    content: {
        padding: 24,
        paddingTop: 30,
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },

    inputIcon: {
        marginRight: 12,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },

    button: {
        backgroundColor: '#1ec8a5',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#1ec8a5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePasswordScreen;