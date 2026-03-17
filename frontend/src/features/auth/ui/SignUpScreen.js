import { useState } from 'react';
import {
	Image,
	Keyboard, Platform, ScrollView, StyleSheet, Text,
	TextInput, TouchableOpacity, TouchableWithoutFeedback,
	View, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../app/providers/AuthProvider';
import apiClient from '../../../shared/services/http/apiClient';

export default function SignUpScreen({ navigation }) {
	const { login } = useAuth();
	const { width } = useWindowDimensions();
	const isNarrow = width < 500;

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [focusedField, setFocusedField] = useState(null);

	const constantTimeStringEquals = (left, right) => {
		const leftValue = typeof left === 'string' ? left : '';
		const rightValue = typeof right === 'string' ? right : '';
		const maxLength = Math.max(leftValue.length, rightValue.length);

		let diff = leftValue.length ^ rightValue.length;
		for (let index = 0; index < maxLength; index += 1) {
			const leftCode = index < leftValue.length ? leftValue.charCodeAt(index) : 0;
			const rightCode = index < rightValue.length ? rightValue.charCodeAt(index) : 0;
			diff |= leftCode ^ rightCode;
		}

		return diff === 0;
	};

	const validateForm = () => {
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !userName.trim() || !password.trim() || !confirmPassword.trim()) {
			setError('Please fill in all required fields.');
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.');
			return false;
		}
		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return false;
		}
		if (!constantTimeStringEquals(password, confirmPassword)) {
			setError('Passwords do not match.');
			return false;
		}
		return true;
	};

	const handleRegularSignup = async () => {
		setError('');
		if (!validateForm()) return;
		try {
			setIsSubmitting(true);
			await apiClient.post('/api/v1/auth/signup/basic', { email, userName, password, firstName, lastName });
			await apiClient.post('/api/v1/auth/signup/regular', { email });
			const loginResponse = await apiClient.post('/api/v1/auth/signin', { email, password });
			await login(loginResponse.data.token, {
				id: loginResponse.data.id,
				username: loginResponse.data.username,
				roles: loginResponse.data.roles,
			});
		} catch (err) {
			let msg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed.';
			msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
			if (msg.toLowerCase().includes('username')) setError('This username is already taken.');
			else if (msg.toLowerCase().includes('email')) setError('This email is already registered.');
			else setError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBusinessSignup = async () => {
		setError('');
		if (!validateForm()) return;
		try {
			setIsSubmitting(true);
			await apiClient.post('/api/v1/auth/signup/basic', { email, userName, password, firstName, lastName });
			navigation.navigate('BusinessSignup', { email, password });
		} catch (err) {
			let msg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed.';
			msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
			if (msg.toLowerCase().includes('username')) setError('This username is already taken.');
			else if (msg.toLowerCase().includes('email')) setError('This email is already registered.');
			else setError(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderInput = (label, value, onChangeText, fieldKey, opts = {}) => (
		<View style={{ marginTop: 14 }}>
			<Text style={styles.label}>{label}</Text>
			<View style={[styles.inputWrapper, focusedField === fieldKey && styles.inputFocused]}>
				{opts.icon && <Ionicons name={opts.icon} size={18} color="#1f2937" style={{ marginRight: 10 }} />}
				<TextInput
					value={value}
					onChangeText={onChangeText}
					secureTextEntry={opts.secure && !opts.show}
					keyboardType={opts.keyboardType}
					autoCapitalize={opts.autoCapitalize || 'sentences'}
					placeholder={opts.placeholder || ''}
					placeholderTextColor="#c0c5ce"
					style={styles.input}
					onFocus={() => setFocusedField(fieldKey)}
					onBlur={() => setFocusedField(null)}
				/>
				{opts.secure && (
					<TouchableOpacity
						onPress={opts.onToggleShow}
						activeOpacity={0.7}
						accessibilityRole="button"
						accessibilityLabel={opts.show ? 'Hide password' : 'Show password'}
					>
						<Ionicons
							name={opts.show ? 'eye-off-outline' : 'eye-outline'}
							size={20}
							color="#6b7280"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);

	const content = (
		<View style={styles.screen}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View style={[styles.card, isNarrow && { marginHorizontal: 16 }]}>
					{/* Back */}
					<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
						<Ionicons name="chevron-back" size={24} color="#667eea" />
					</TouchableOpacity>

					{/* Header */}
					<View style={styles.logoContainer}>
						<Image
							source={require('../../../../assets/logo.png')}
							style={styles.logoImage}
							resizeMode="contain"
						/>
					</View>
					<Text style={styles.title}>Create Account</Text>
					<Text style={styles.subtitle}>Fill in the details below</Text>

					{/* Fields */}
					{renderInput('First Name *', firstName, setFirstName, 'fn', { icon: 'person-outline', placeholder: 'John' })}
					{renderInput('Last Name *', lastName, setLastName, 'ln', { icon: 'person-outline', placeholder: 'Doe' })}
					{renderInput('Email *', email, setEmail, 'em', { icon: 'mail-outline', keyboardType: 'email-address', autoCapitalize: 'none', placeholder: 'you@example.com' })}
					{renderInput('Username *', userName, setUserName, 'un', { icon: 'at-outline', autoCapitalize: 'none', placeholder: 'johndoe' })}
					{renderInput('Password *', password, setPassword, 'pw', {
						icon: 'lock-closed-outline',
						secure: true,
						show: showPassword,
						onToggleShow: () => setShowPassword((prev) => !prev),
						placeholder: '********',
					})}
					{renderInput('Confirm Password *', confirmPassword, setConfirmPassword, 'cpw', {
						icon: 'lock-closed-outline',
						secure: true,
						show: showConfirmPassword,
						onToggleShow: () => setShowConfirmPassword((prev) => !prev),
						placeholder: '********',
					})}

					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					{/* Sign Up As */}
					<Text style={styles.sectionLabel}>SIGN UP AS</Text>

					<View style={styles.buttonsRow}>
						<TouchableOpacity
							onPress={handleBusinessSignup}
							disabled={isSubmitting}
							activeOpacity={0.85}
							style={styles.btnHalf}
						>
							<LinearGradient
								colors={['#f59e0b', '#ef4444']}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.businessBtn}
							>
								<Ionicons name="star" size={18} color="#fff" />
								<Text style={styles.businessBtnText}>Business</Text>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleRegularSignup}
							disabled={isSubmitting}
							activeOpacity={0.85}
							style={styles.btnHalf}
						>
							<View style={styles.normalBtn}>
								<Ionicons name="person" size={18} color="#374151" />
								<Text style={styles.normalBtnText}>Normal</Text>
							</View>
						</TouchableOpacity>
					</View>

					{/* Back to login */}
					<TouchableOpacity
						onPress={() => navigation.navigate('Login')}
						style={styles.linkBtn}
						activeOpacity={0.7}
					>
						<Text style={styles.linkText}>Already have an account? <Text style={{ fontWeight: '700' }}>Sign In</Text></Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);

	if (Platform.OS === 'web') return content;
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			{content}
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#f3f4f6',
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	card: {
		width: '100%',
		maxWidth: 440,
		backgroundColor: '#fff',
		borderRadius: 28,
		padding: 28,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.06,
		shadowRadius: 24,
		elevation: 6,
	},
	backBtn: {
		width: 40,
		height: 40,
		borderRadius: 12,
		backgroundColor: '#f3f4f6',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 16,
	},
	logoImage: {
		width: 88,
		height: 88,
	},
	title: {
		fontSize: 24,
		fontWeight: '800',
		color: '#1f2937',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 14,
		color: '#9ca3af',
		textAlign: 'center',
		marginTop: 4,
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 6,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f9fafb',
		borderWidth: 1.5,
		borderColor: '#e5e7eb',
		borderRadius: 14,
		paddingHorizontal: 14,
		height: 48,
	},
	inputFocused: {
		borderColor: '#dc2626',
		backgroundColor: '#fff',
	},
	input: {
		flex: 1,
		fontSize: 15,
		color: '#1f2937',
		height: '100%',
		outlineStyle: 'none',
	},
	errorText: {
		color: '#ef4444',
		fontSize: 13,
		textAlign: 'center',
		marginTop: 14,
	},
	sectionLabel: {
		fontSize: 12,
		fontWeight: '700',
		color: '#9ca3af',
		textAlign: 'center',
		marginTop: 24,
		marginBottom: 14,
		letterSpacing: 1,
	},
	buttonsRow: {
		flexDirection: 'row',
		gap: 12,
	},
	btnHalf: {
		flex: 1,
	},
	businessBtn: {
		borderRadius: 14,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		shadowColor: '#f59e0b',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 5,
	},
	businessBtnText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 15,
	},
	normalBtn: {
		backgroundColor: '#f3f4f6',
		borderRadius: 14,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	normalBtnText: {
		color: '#374151',
		fontWeight: '700',
		fontSize: 15,
	},
	linkBtn: {
		marginTop: 20,
		alignItems: 'center',
	},
	linkText: {
		fontSize: 14,
		color: '#b91c1c',
	},
});
