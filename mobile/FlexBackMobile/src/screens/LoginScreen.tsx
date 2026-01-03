import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image, Dimensions } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useAuthManager } from '../hooks/useAuthManager';

const { height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const {
    username, setUsername,
    password, setPassword,
    showPass, setShowPass,
    loading,
    handleLogin
  } = useAuthManager(navigation);

  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
        <Image 
          source={require('../../assets/rehab_concept.jpg')} 
          style={styles.topImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.bottomSection}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Chào mừng</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục lộ trình phục hồi của bạn</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} placeholder="Tên đăng nhập" placeholderTextColor="#aaa"
                value={username} onChangeText={setUsername} autoCapitalize="none"
              />
              {username.length > 0 && <Feather name="check-circle" size={20} color="#1ec8a5" />}
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} placeholder="Mật khẩu" placeholderTextColor="#aaa"
                secureTextEntry={!showPass} value={password} onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Feather name={showPass ? "eye" : "eye-off"} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Đăng Nhập</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topSection: {
    height: height * 0.4,
    width: '100%',
    position: 'relative',
  },

  topImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,

    paddingHorizontal: 24,
    paddingTop: 30,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
  },

  orText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },

  form: {
    gap: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 56,
    paddingHorizontal: 16,

    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  loginButton: {
    height: 56,
    marginTop: 10,

    backgroundColor: '#1ec8a5',
    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#1ec8a5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  forgotButton: {
    alignSelf: 'flex-end',
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1ec8a5',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  footerText: {
    fontSize: 14,
    color: '#888',
  },

  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1ec8a5',
  },
});


export default LoginScreen;


