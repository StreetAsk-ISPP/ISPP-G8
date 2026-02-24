import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import apiClient from '../services/apiClient';

export default function SignUpScreen({ navigation }) {
	const { login } = useAuth();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [focusedField, setFocusedField] = useState(null);

	const validateForm = () => {
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !userName.trim() || !password.trim()) {
			setError('Please fill in all required fields.');
			return false;
		}

		// Validar formato de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.');
			return false;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return false;
		}

		return true;
	};

	const handleNormalSignup = async () => {
		setError('');

		if (!validateForm()) {
			return;
		}

		try {
			setIsSubmitting(true);
			
			// Paso 1: Crear usuario básico
			await apiClient.post('/api/v1/auth/signup/basic', {
				email,
				userName,
				password,
				firstName,
				lastName,
			});

			// Paso 2: Completar como usuario normal
			await apiClient.post('/api/v1/auth/signup/normal', {
				email,
			});

			// Paso 3: Login automático
			const loginResponse = await apiClient.post('/api/v1/auth/signin', {
				email,
				password,
			});
			
			// Guardar token y redirigir a Home
			await login(loginResponse.data.token);
		} catch (err) {
			let errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Please try again.';
			
			// Convertir a string si es necesario
			errorMessage = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
			
			// Verificar si es error de email duplicado
			if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('already')) {
				setError('This email is already registered. Please use a different email or try logging in.');
			} else {
				setError(errorMessage);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBusinessSignup = async () => {
		setError('');

		if (!validateForm()) {
			return;
		}

		try {
			setIsSubmitting(true);

			// Crear usuario básico
			await apiClient.post('/api/v1/auth/signup/basic', {
				email,
				userName,
				password,
				firstName,
				lastName,
			});

			// Navegar a la segunda pantalla de business
			navigation.navigate('BusinessSignup', {
				email,
				password,
			});
		} catch (err) {
			let errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Please try again.';
			
			// Convertir a string si es necesario
			errorMessage = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
			
			// Verificar si es error de email duplicado
			if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('already')) {
				setError('This email is already registered. Please use a different email or try logging in.');
			} else {
				setError(errorMessage);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={globalStyles.screen}>
			<View style={styles.container}>
				<View style={styles.backButtonWrapper}>
					<TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
						<Ionicons name="chevron-back" size={32} color="#334155" />
					</TouchableOpacity>
				</View>
				{/* Logo/Icon */}
				<View style={styles.logoContainer}>
					<Image 
						source={require('../../assets/logo.png')} 
						style={styles.logoImage}
						resizeMode="contain"
					/>
				</View>

				<Text style={styles.title}>Sign Up</Text>

				{/* Form Fields */}
				<View style={styles.form}>
					<Text style={styles.label}>First Name*</Text>
					<View style={styles.inputContainer}>
						{!firstName && focusedField !== 'firstName' && <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
						<TextInput
							value={firstName}
							onChangeText={setFirstName}
							onFocus={() => setFocusedField('firstName')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={styles.inputWithIcon}
						/>
					</View>

					<Text style={styles.label}>Last Name*</Text>
					<View style={styles.inputContainer}>
						{!lastName && focusedField !== 'lastName' && <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
						<TextInput
							value={lastName}
							onChangeText={setLastName}
							onFocus={() => setFocusedField('lastName')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={styles.inputWithIcon}
						/>
					</View>

					<Text style={styles.label}>Email*</Text>
					<View style={styles.inputContainer}>
						{!email && focusedField !== 'email' && <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
						<TextInput
							value={email}
							onChangeText={setEmail}
							onFocus={() => setFocusedField('email')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							keyboardType="email-address"
							autoCapitalize="none"
							style={styles.inputWithIcon}
						/>
					</View>

					<Text style={styles.label}>User Name*</Text>
					<View style={styles.inputContainer}>
						{!userName && focusedField !== 'userName' && <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
						<TextInput
							value={userName}
							onChangeText={setUserName}
							onFocus={() => setFocusedField('userName')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							autoCapitalize="none"
							style={styles.inputWithIcon}
						/>
					</View>

					<Text style={styles.label}>Password*</Text>
					<View style={styles.inputContainer}>
						{!password && focusedField !== 'password' && <Ionicons name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />}
						<TextInput
							value={password}
							onChangeText={setPassword}
							onFocus={() => setFocusedField('password')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							secureTextEntry
							style={styles.inputWithIcon}
						/>
					</View>
					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					{/* Sign Up As Section */}
					<View style={styles.buttonsSection}>
						<Text style={styles.signUpAsText}>SIGN UP AS</Text>

						<View style={styles.buttonsRow}>
							<View style={styles.buttonContainer}>
							<TouchableOpacity
								onPress={handleBusinessSignup}
								disabled={isSubmitting}
								activeOpacity={0.8}
							>
								<LinearGradient
									colors={['#F59E0B', '#EF4444', '#8B5CF6']}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.businessButton}
								>
									<View style={styles.businessButtonContent}>
									<Text style={styles.businessButtonStar}>⭐</Text>
									<View style={styles.businessButtonTextContainer}>
										<Text style={styles.businessButtonText}>Business</Text>
										<Text style={styles.businessButtonText}>account</Text>
									</View>
									</View>
								</LinearGradient>
							</TouchableOpacity>
						</View>

					<View style={styles.buttonContainer}>
					<TouchableOpacity
						onPress={handleNormalSignup}
						disabled={isSubmitting}
						activeOpacity={0.8}
					>
						<LinearGradient
							colors={['#94A3B8', '#64748B', '#475569']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.normalButton}
						>
						<View style={styles.normalButtonTextContainer}>
							<Text style={styles.normalButtonText}>Normal</Text>
							<Text style={styles.normalButtonText}>account</Text>
						</View>
						</LinearGradient>
					</TouchableOpacity>
					</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 16,
		justifyContent: 'center',
	},
	backButtonWrapper: {
		position: 'absolute',
		top: 6,
		left: 4,
		zIndex: 2,
	},
	logoContainer: {
		marginBottom: 16,
		alignItems: 'center',
	},
	logoImage: {
		width: 80,
		height: 80,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#334155',
		marginBottom: 16,
	},
	form: {
		width: '100%',
		paddingHorizontal: 24,
	},
	label: {
		fontSize: 14,
		color: '#0F172A',
		marginBottom: 4,
		marginTop: 8,
		fontWeight: '500',
	},
	input: {
		borderWidth: 2,
		borderColor: '#CBD5E1',
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
		color: '#0F172A',
		height: 42,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#CBD5E1',
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 12,
		height: 42,
	},
	inputIcon: {
		marginRight: 8,
	},
	inputWithIcon: {
		flex: 1,
		fontSize: 14,
		color: '#0F172A',
		height: '100%',
		outlineStyle: 'none',
	},
	errorText: {
		marginTop: 8,
		color: '#DC2626',
		fontSize: 12,
		textAlign: 'center',
	},
	buttonsSection: {
		marginTop: 20,
		marginBottom: 12,
	},
	signUpAsText: {
		fontSize: 20,
		fontWeight: '700',
		color: '#991B1B',
		textAlign: 'center',
		marginBottom: 16,
	},
	buttonsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	buttonContainer: {
		flex: 1,
	},
	businessButton: {
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	businessButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	businessButtonTextContainer: {
		flex: 1,
		alignItems: 'center',
	},
	businessButtonText: {
		color: '#FCD34D',
		fontWeight: '700',
		fontSize: 18,
		lineHeight: 20,
	},
	businessButtonStar: {
		fontSize: 28,
		marginRight: 8,
	},
	normalButton: {
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	normalButtonTextContainer: {
		alignItems: 'center',
	},
	normalButtonText: {
		color: '#1F2937',
		fontWeight: '700',
		fontSize: 18,
		lineHeight: 20,
		textAlign: 'center',
	},
});
