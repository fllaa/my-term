import { Card, useThemeColor } from "heroui-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

function signUpHandler({
	name,
	email,
	password,
	setError,
	setIsLoading,
	setName,
	setEmail,
	setPassword,
}) {
	setIsLoading(true);
	setError(null);

	authClient.signUp.email(
		{
			name,
			email,
			password,
		},
		{
			onError(error) {
				setError(error.error?.message || "Failed to sign up");
				setIsLoading(false);
			},
			onSuccess() {
				setName("");
				setEmail("");
				setPassword("");
				queryClient.refetchQueries();
			},
			onFinished() {
				setIsLoading(false);
			},
		},
	);
}

export function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mutedColor = useThemeColor("muted");
	const accentColor = useThemeColor("accent");
	const foregroundColor = useThemeColor("foreground");
	const dangerColor = useThemeColor("danger");

	function handlePress() {
		signUpHandler({
			name,
			email,
			password,
			setError,
			setIsLoading,
			setName,
			setEmail,
			setPassword,
		});
	}

	return (
		<Card variant="secondary" className="mt-6 p-4">
			<Card.Title className="mb-4">Create Account</Card.Title>

			{error && (
				<View className="mb-4 rounded-lg bg-danger/10 p-3">
					<Text className="text-danger text-sm">{error}</Text>
				</View>
			)}

			<TextInput
				className="mb-3 rounded-lg border border-divider bg-surface px-4 py-3 text-foreground"
				placeholder="Name"
				value={name}
				onChangeText={setName}
				placeholderTextColor={mutedColor}
			/>

			<TextInput
				className="mb-3 rounded-lg border border-divider bg-surface px-4 py-3 text-foreground"
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				placeholderTextColor={mutedColor}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<TextInput
				className="mb-4 rounded-lg border border-divider bg-surface px-4 py-3 text-foreground"
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				placeholderTextColor={mutedColor}
				secureTextEntry
			/>

			<Pressable
				onPress={handlePress}
				disabled={isLoading}
				className="flex-row items-center justify-center rounded-lg bg-accent p-4 active:opacity-70"
			>
				{isLoading ? (
					<ActivityIndicator size="small" color={foregroundColor} />
				) : (
					<Text className="font-medium text-foreground">Sign Up</Text>
				)}
			</Pressable>
		</Card>
	);
}
