import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../constants/theme';
import apiClient from '../services/apiClient';

export default function LoginScreen() {
	const { login } = useAuth();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLogin = async () => {
		setError('');

		if (!username.trim() || !password.trim()) {
			setError('Please enter username and password.');
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await apiClient.post('/api/v1/auth/signin', { username, password });
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
					value={username}
					onChangeText={setUsername}
					placeholder="Username"
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
		fontSize: theme.typography.body,
		color: theme.colors.textPrimary,
	},
	errorText: {
		marginTop: 8,
		color: theme.colors.danger,
		fontSize: theme.typography.caption,
	},
};

