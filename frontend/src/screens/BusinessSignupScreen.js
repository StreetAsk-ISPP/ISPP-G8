import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import apiClient from '../services/apiClient';

export default function BusinessSignupScreen({ navigation, route }) {
	const { email } = route.params;

	const [nif, setNif] = useState('');
	const [address, setAddress] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleProceedToPayment = async () => {
		setError('');

		if (!nif.trim()) {
			setError('NIF is required.');
			return;
		}

		try {
			setIsSubmitting(true);

			await apiClient.post('/api/v1/auth/signup/business', {
				email,
				nif,
				address: address.trim() || null,
			});

			navigation.navigate('PaymentGatewayPlaceholder', {
				email,
				nif,
				address: address.trim() || null,
			});
		} catch (err) {
			let errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Please try again.';
			errorMessage = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);

			if (errorMessage.toLowerCase().includes('nif') || errorMessage.toLowerCase().includes('cif') || errorMessage.toLowerCase().includes('already')) {
				setError('This NIF is already registered. Please use a different NIF.');
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
				{/* Header with logo and title */}
				<View style={styles.header}>
					<Image 
						source={require('../../assets/logo.png')} 
						style={styles.logoImage}
						resizeMode="contain"
					/>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Business account</Text>
						<Text style={styles.subtitle}>extra information required</Text>
					</View>
				</View>

				{/* Form Fields */}
				<View style={styles.form}>
					<Text style={styles.label}>NIF*</Text>
					<TextInput
						value={nif}
						onChangeText={setNif}
						placeholder=""
						style={styles.input}
						autoCapitalize="characters"
					/>

					<Text style={styles.label}>Address</Text>
					<TextInput
						value={address}
						onChangeText={setAddress}
						placeholder=""
						style={styles.input}
					/>

					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					{/* Benefits Section */}
					<View style={styles.benefitsSection}>
						<Text style={styles.benefitsTitle}>You will gain:</Text>
						<View style={styles.benefitsList}>
							<Text style={styles.benefitItem}>• Access to sponsored events and live chats for your events.</Text>
							<Text style={styles.benefitItem}>• Tools to promote your events and manage event chats.</Text>
							<Text style={styles.benefitItem}>• Sponsored account for increased visibility.</Text>
							<Text style={styles.benefitItem}>• Ability to create an unlimited number of events.</Text>
							<Text style={styles.benefitItem}>• Full event customization (picture, description, and participant limit)</Text>
						</View>
					</View>

					{/* Proceed Button */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={handleProceedToPayment}
							disabled={isSubmitting}
							activeOpacity={0.8}
						>
							<LinearGradient
								colors={['#F59E0B', '#EF4444', '#8B5CF6']}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.proceedButton}
							>
								<Text style={styles.proceedButtonText}>{isSubmitting ? 'Processing...' : 'Proceed to payment'}</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 20,
		paddingHorizontal: 24,
		justifyContent: 'space-between',
	},
	backButtonWrapper: {
		position: 'absolute',
		top: 6,
		left: 4,
		zIndex: 2,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
		gap: 16,
	},
	logoImage: {
		width: 100,
		height: 100,
	},
	titleContainer: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#334155',
		marginBottom: 2,
	},
	subtitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#334155',
		lineHeight: 28,
	},
	form: {
		width: '100%',
		marginTop: 2,
	},
	label: {
		fontSize: 14,
		color: '#0F172A',
		marginBottom: 6,
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
	errorText: {
		marginTop: 8,
		color: '#DC2626',
		fontSize: 12,
		textAlign: 'center',
	},
	benefitsSection: {
		marginTop: 16,
		marginBottom: 16,
	},
	benefitsTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#EAB308',
		marginBottom: 10,
	},
	benefitsList: {
		gap: 6,
	},
	benefitItem: {
		fontSize: 16,
		color: '#0F172A',
		lineHeight: 20,
	},
	buttonContainer: {
		marginTop: 16,
		marginBottom: 8,
	},
	proceedButton: {
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	proceedButtonText: {
		color: '#FCD34D',
		fontWeight: '700',
		fontSize: 21,
		lineHeight: 24,
	},
});
