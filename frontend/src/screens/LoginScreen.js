import { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../constants/theme';
import apiClient from '../services/apiClient';

export default function LoginScreen({ navigation }) {
	const { login } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async () => {
		setError('');

		if (!email.trim() || !password.trim()) {
			setError('Please enter email and password.');
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await apiClient.post('/api/v1/auth/signin', { email, password });
			await login(response.data.token);
		} catch {
			setError('Login failed. Please check your credentials.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={globalStyles.screen}>
			<View style={globalStyles.card}>
				<Text style={globalStyles.title}>Sign In</Text>
				<Text style={globalStyles.subtitle}>Log in to access the app.</Text>

				<View style={{ height: 16 }} />

				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					style={styles.input}
				/>

				<View style={{ height: 8 }} />

				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Password"
					secureTextEntry
					style={styles.input}
				/>

				{error ? <Text style={styles.errorText}>{error}</Text> : null}

				<View style={{ height: 16 }} />

				<CustomButton
					label={isSubmitting ? 'Signing in...' : 'Sign In'}
					onPress={handleLogin}
				/>

				<View style={{ height: 16 }} />

				<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
					<Text style={styles.signUpLink}>
						Don’t have an account? <Text style={styles.signUpLinkBold}>Sign Up</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = {
	input: {
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.radius.md,
		backgroundColor: theme.colors.surface,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
	signUpLink: {
		textAlign: 'center',
		color: theme.colors.textSecondary,
		fontSize: theme.typography.body,
	},
	signUpLinkBold: {
		color: theme.colors.primary,
		fontWeight: '700',
	},
		fontSize: theme.typography.body,
		color: theme.colors.textPrimary,
	},
	errorText: {
		marginTop: 8,
		color: theme.colors.danger,
		fontSize: theme.typography.caption,
	},
};

