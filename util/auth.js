import {
	createUserWithEmailAndPassword,
	deleteUser,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';

export function signUp(auth, emailId, password) {
	return createUserWithEmailAndPassword(auth, emailId.trim(), password.trim());
}

export function signIn(auth, emailId, password) {
	return signInWithEmailAndPassword(auth, emailId.trim(), password.trim());
}

export function logOut(auth) {
	//TODO: remove this later
	deleteUserDetails(auth);

	signOut(auth)
		.then(() => {
			console.log('User signed out!');
		})
		.catch((error) => {
			console.error(error);
		});
}

function deleteUserDetails(auth) {
	deleteUser(auth.currentUser)
		.then(() => {
			console.log('User deleted out!');
		})
		.catch((error) => {
			console.error(error);
		});
}
