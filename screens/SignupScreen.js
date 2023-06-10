import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';

function SignupScreen() {
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const authCtx = useContext(AuthContext);

	async function signupHandler({ email, password, profileName }) {
		setIsAuthenticating(true);
		try {
			const result = await authCtx.authenticate(
				false,
				email,
				password,
				profileName
			);
			if (!result) {
				Alert.alert(
					'Authentication failed',
					'Could not create user, please check your input and try again later.'
				);
				setIsAuthenticating(false);
			}
		} catch (error) {
			Alert.alert(
				'Authentication failed',
				'Could not create user, please check your input and try again later.'
			);
			setIsAuthenticating(false);
		}
	}

	if (isAuthenticating) {
		return <LoadingOverlay message='Creating user...' />;
	}

	return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
