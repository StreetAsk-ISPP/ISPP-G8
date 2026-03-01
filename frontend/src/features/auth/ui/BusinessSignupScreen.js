import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';
import apiClient from '../../../shared/services/http/apiClient';

export default function BusinessSignupScreen({ navigation, route }) {
	const { email } = route.params;

	const [taxId, setTaxId] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [address, setAddress] = useState('');
	const [website, setWebsite] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [focusedField, setFocusedField] = useState(null);

	const handleProceedToPayment = async () => {
		setError('');

		if (!taxId.trim()) {
			setError('Tax ID is required.');
			return;
		}

		if (!companyName.trim()) {
			setError('Company Name is required.');
			return;
		}

		try {
			setIsSubmitting(true);
			const normalizedTaxId = taxId.trim().toUpperCase();

			// TODO: Tax ID/business data should be persisted only after successful payment.
			// Current pre-payment registration flow is kept temporarily for testing purposes.
			await apiClient.post('/api/v1/auth/signup/business', {
				email,
				taxId: normalizedTaxId,
				companyName: companyName.trim(),
				address: address.trim() || null,
				website: website.trim() || null,
				description: description.trim() || null,
			});

			navigation.navigate('PaymentGatewayPlaceholder', {
				email,
				taxId: normalizedTaxId,
				companyName: companyName.trim(),
				address: address.trim() || null,
				website: website.trim() || null,
				description: description.trim() || null,
			});
		} catch (err) {
			let errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Please try again.';
			errorMessage = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);

			if (errorMessage.toLowerCase().includes('invalid tax id') ||
				errorMessage.toLowerCase().includes('tax id format')) {
				setError('Tax ID must be: 1 letter + 7 digits + 1 control character.');
			} else if (errorMessage.toLowerCase().includes('tax id is already registered') ||
				errorMessage.toLowerCase().includes('taxid is already registered')) {
				setError('This Tax ID is already registered. Please use a different Tax ID.');
			} else if (errorMessage.toLowerCase().includes('already completed')) {
				setError('This account has already been completed. Please log in.');
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
						source={require('../../../../assets/logo.png')} 
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
					<Text style={styles.label}>Tax ID*</Text>
					<View style={styles.inputContainer}>
						{!taxId && focusedField !== 'taxId' && (
							<Ionicons name="pricetag-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
						)}
						<TextInput
							value={taxId}
							onChangeText={setTaxId}
							onFocus={() => setFocusedField('taxId')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={[styles.inputWithIcon, (taxId || focusedField === 'taxId') && styles.inputWithoutIcon]}
							autoCapitalize="characters"
						/>
					</View>

					<Text style={styles.label}>Company Name*</Text>
					<View style={styles.inputContainer}>
						{!companyName && focusedField !== 'companyName' && (
							<Ionicons name="business-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
						)}
						<TextInput
							value={companyName}
							onChangeText={setCompanyName}
							onFocus={() => setFocusedField('companyName')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={[styles.inputWithIcon, (companyName || focusedField === 'companyName') && styles.inputWithoutIcon]}
						/>
					</View>

					<Text style={styles.label}>Address</Text>
					<View style={styles.inputContainer}>
						{!address && focusedField !== 'address' && (
							<Ionicons name="location-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
						)}
						<TextInput
							value={address}
							onChangeText={setAddress}
							onFocus={() => setFocusedField('address')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={[styles.inputWithIcon, (address || focusedField === 'address') && styles.inputWithoutIcon]}
						/>
					</View>

					<Text style={styles.label}>Website</Text>
					<View style={styles.inputContainer}>
						{!website && focusedField !== 'website' && (
							<Ionicons name="globe-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
						)}
						<TextInput
							value={website}
							onChangeText={setWebsite}
							onFocus={() => setFocusedField('website')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={[styles.inputWithIcon, (website || focusedField === 'website') && styles.inputWithoutIcon]}
							autoCapitalize="none"
						/>
					</View>

					<Text style={styles.label}>Description</Text>
					<View style={[styles.inputContainer, styles.descriptionContainer]}>
						{!description && focusedField !== 'description' && (
							<Ionicons name="document-text-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
						)}
						<TextInput
							value={description}
							onChangeText={setDescription}
							onFocus={() => setFocusedField('description')}
							onBlur={() => setFocusedField(null)}
							placeholder=""
							style={[styles.inputWithIcon, styles.descriptionInput, (description || focusedField === 'description') && styles.inputWithoutIcon]}
							multiline
						/>
					</View>

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
		paddingVertical: 12,
		paddingHorizontal: 16,
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
		marginTop: 20,
		marginBottom: 6,
		gap: 10,
	},
	logoImage: {
		width: 64,
		height: 64,
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
		marginTop: -8,
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
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 10,
		paddingVertical: 6,
		fontSize: 14,
		color: '#0F172A',
		height: 34,
	},
	inputContainer: {
		position: 'relative',
		justifyContent: 'center',
	},
	inputIcon: {
		position: 'absolute',
		left: 10,
		zIndex: 1,
	},
	inputWithIcon: {
		borderWidth: 2,
		borderColor: '#CBD5E1',
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 10,
		paddingLeft: 34,
		paddingVertical: 6,
		fontSize: 14,
		color: '#0F172A',
		height: 34,
	},
	inputWithoutIcon: {
		paddingLeft: 10,
	},
	descriptionContainer: {
		alignItems: 'stretch',
	},
	descriptionInput: {
		height: 44,
		textAlignVertical: 'top',
	},
	errorText: {
		marginTop: 6,
		color: '#DC2626',
		fontSize: 11,
		textAlign: 'center',
	},
	benefitsSection: {
		marginTop: 10,
		marginBottom: 10,
	},
	benefitsTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#EAB308',
		marginBottom: 4,
	},
	benefitsList: {
		gap: 3,
	},
	benefitItem: {
		fontSize: 13,
		color: '#0F172A',
		lineHeight: 13,
	},
	buttonContainer: {
		marginTop: 10,
		marginBottom: 4,
	},
	proceedButton: {
		borderRadius: 12,
		paddingVertical: 10,
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
		fontSize: 18,
		lineHeight: 20,
	},
});
