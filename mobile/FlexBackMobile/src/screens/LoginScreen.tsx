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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.bottomSection}
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
              {username.length > 0 && <Feather name="check-circle" size={20} color="#00C269" />}
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

            <TouchableOpacity style={styles.forgotButton}>
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
  container: { flex: 1, backgroundColor: '#fff' },
  topSection: {
    height: height * 0.4, width: '100%', position: 'relative',
  },
  topImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  bottomSection: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, paddingHorizontal: 24, paddingTop: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10, 
  },
  scrollContent: { paddingBottom: 20 },
  header: { marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666' },
  orText: { textAlign: 'center', color: '#999', fontSize: 12, marginBottom: 20 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9',
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 12, paddingHorizontal: 16, height: 56,
  },
  input: { flex: 1, fontSize: 15, color: '#333' },
  loginButton: {
    backgroundColor: '#00C269', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center',
    marginTop: 10, shadowColor: "#00C269", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forgotButton: { alignSelf: 'flex-end' },
  forgotText: { color: '#00C269', fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#888', fontSize: 14 },
  linkText: { color: '#00C269', fontWeight: 'bold', fontSize: 14 }
});

export default LoginScreen;


