import {
	Alert,
	AlertIcon,
	Box,
	Button,
	chakra,
	FormControl,
	Input,
	Link,
	Text
} from "@chakra-ui/react";
import CenterContainer from "@components/ui/CenterContainer";
import PasswordInput from "@components/ui/PasswordInput";
import useUser from "@hooks/useUser";
import { sendEvent } from "@util/firebase";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Login() {
	const { login, currentUser, loading: authLoading } = useUser();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (loading || authLoading) return;
		if (currentUser) router.push("/");
	}, [currentUser, loading, authLoading]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			setError("");
			setLoading(true);
			await login(email, password);
			sendEvent("login", { email });
		} catch (err) {
			setError(err.message.replace("Firebase: ", ""));
		}
		setLoading(false);
	};

	return (
		<>
			<Head>
				<title>firefiles - Login</title>
			</Head>
			<CenterContainer>
				<Box
					w="sm"
					px="6"
					py="8"
					borderRadius="md"
					boxShadow="4.1px 4.1px 6.5px -1.7px rgba(0,0,0,0.2)"
				>
					<Text as="h2" fontSize="2xl" align="center" mb="8">
						👋 Login
					</Text>
					{error && (
						<Alert status="error" fontSize="md">
							<AlertIcon />
							{error}
						</Alert>
					)}
					<Box as="form" onSubmit={handleSubmit}>
						<FormControl id="email" my="3">
							<Input
								variant="outline"
								placeholder="Enter your email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</FormControl>
						<FormControl id="password" mb="3">
							<PasswordInput
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>
						<Button
							mb="3"
							colorScheme="green"
							variant="solid"
							isLoading={loading}
							w="full"
							type="submit"
						>
							Login
						</Button>
						<Text as="p" fontSize="xs" align="center">
							Check out the{" "}
							<Link
								href="https://firefiles.vercel.app/docs/self-hosted/01-setup#authentication-and-cloud-storage"
								target="_blank"
								textDecor="underline"
								cursor="pointer"
							>
								docs
							</Link>{" "}
							for account-related info.
						</Text>
					</Box>
				</Box>
			</CenterContainer>
		</>
	);
}
