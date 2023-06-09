import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../ui/Button';
import Input from './Input';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
	const [enteredEmail, setEnteredEmail] = useState('');
	const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
	const [enteredPassword, setEnteredPassword] = useState('');
	const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
	const [enteredProfileName, setEnteredProfileName] = useState('');

	const {
		email: emailIsInvalid,
		confirmEmail: emailsDontMatch,
		password: passwordIsInvalid,
		confirmPassword: passwordsDontMatch,
		profileName: profileNameInvalid,
	} = credentialsInvalid;

	function updateInputValueHandler(inputType, enteredValue) {
		switch (inputType) {
			case 'email':
				setEnteredEmail(enteredValue);
				break;
			case 'confirmEmail':
				setEnteredConfirmEmail(enteredValue);
				break;
			case 'password':
				setEnteredPassword(enteredValue);
				break;
			case 'confirmPassword':
				setEnteredConfirmPassword(enteredValue);
				break;
			case 'profileName':
				setEnteredProfileName(enteredValue);
				break;
		}
	}

	function submitHandler() {
		onSubmit({
			email: enteredEmail,
			confirmEmail: enteredConfirmEmail,
			password: enteredPassword,
			confirmPassword: enteredConfirmPassword,
			profileName: enteredProfileName,
		});
	}

	return (
		<View style={styles.form}>
			<View>
				<Input
					label='Email Address'
					onUpdateValue={updateInputValueHandler.bind(this, 'email')}
					value={enteredEmail}
					keyboardType='email-address'
					isInvalid={emailIsInvalid}
				/>
				{!isLogin && (
					<Input
						label='Confirm Email Address'
						onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
						value={enteredConfirmEmail}
						keyboardType='email-address'
						isInvalid={emailsDontMatch}
					/>
				)}
				<Input
					label='Password'
					onUpdateValue={updateInputValueHandler.bind(this, 'password')}
					secure
					value={enteredPassword}
					isInvalid={passwordIsInvalid}
				/>
				{!isLogin && (
					<Input
						label='Confirm Password'
						onUpdateValue={updateInputValueHandler.bind(
							this,
							'confirmPassword'
						)}
						secure
						value={enteredConfirmPassword}
						isInvalid={passwordsDontMatch}
					/>
				)}
				{!isLogin && (
					<Input
						label='Profile Name'
						onUpdateValue={updateInputValueHandler.bind(this, 'profileName')}
						value={enteredProfileName}
						isInvalid={profileNameInvalid}
					/>
				)}
				<View style={styles.buttons}>
					<Button onPress={submitHandler}>
						{isLogin ? 'Log In' : 'Sign Up'}
					</Button>
				</View>
			</View>
		</View>
	);
}

export default AuthForm;

const styles = StyleSheet.create({
	buttons: {
		marginTop: 12,
	},
});
