import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../../shared/ui/theme/globalStyles';

export default function PaymentGatewayPlaceholderScreen({ navigation }) {
	return (
		<View style={globalStyles.screen}>
			<View style={styles.container}>
				<View style={styles.backIconWrapper}>
					<TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
						<Ionicons name="chevron-back" size={32} color="#334155" />
					</TouchableOpacity>
				</View>
				<Text style={styles.title}>Payment Gateway (Provisional)</Text>
				<Text style={styles.message}>
					This is a temporary placeholder screen for the payment gateway flow.
				</Text>
				<Text style={styles.warning}>
					IMPORTANT: Remove this screen once the real payment gateway is implemented.
				</Text>
				<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
					<Text style={styles.backButtonText}>Back</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	backIconWrapper: {
		position: 'absolute',
		top: 6,
		left: 4,
		zIndex: 2,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#334155',
		textAlign: 'center',
		marginBottom: 16,
	},
	message: {
		fontSize: 16,
		color: '#0F172A',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 12,
	},
	warning: {
		fontSize: 15,
		fontWeight: '700',
		color: '#DC2626',
		textAlign: 'center',
		lineHeight: 22,
		marginBottom: 24,
	},
	backButton: {
		backgroundColor: '#334155',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 10,
	},
	backButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
	},
});
