import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState } from 'react';

import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../constants/constants';
import { signIn, signUp, logOut } from '../util/auth';
import { getFirestore } from 'firebase/firestore';
import * as Location from 'expo-location';

import {
	createGroup,
	getGroupsById,
	getUsersById,
	getUsersList,
	storeUserData,
	updateGroup,
	updateUser,
} from '../util/database';

export const AuthContext = createContext({
	token: '',
	isAuthenticated: false,
	authenticate: async (isLogin, email, password) => {},
	logout: () => {},
	setToken: (token) => {},
	setUser: (user) => {},
	fetchUsersById: async (userIds) => {},
	updateUserById: (userId, data) => {},
	updateGroupById: (groupId, data) => {},
	fetchGroupsById: async (groupIds) => {},
});

function codeGenerator() {
	return (Math.random() * 1000000).toString().split('.')[0];
}

function AuthContextProvider({ children }) {
	const [authToken, setAuthToken] = useState();

	useEffect(() => {
		let locationUpdatesTask;

		async function locationListener(){
			locationUpdatesTask = Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.BestForNavigation,
					timeInterval: 30000,
					distanceInterval: 10,
				},
				handleLocationUpdate
			);

		}
		
		async function handleLocationUpdate(location) {
			const userId = await AsyncStorage.getItem('userId');
			if (userId) {
				updateUserById(userId, {
					lat: location.coords.latitude,
					long: location.coords.longitude,
				});
			}
		}

		locationListener()

		return () => {
			if(locationUpdatesTask){
				locationUpdatesTask.remove()
			}
		};
	}, []);

	const app = initializeApp(firebaseConfig);

	const auth = getAuth(app);

	const db = getFirestore(app);

	async function authenticate(isLogin, email, password, name = '') {
		try {
			const userCredentials = isLogin
				? await signIn(auth, email, password)
				: await signUp(auth, email, password);
			token = (await userCredentials.user.getIdTokenResult()).token;
			setToken(token);

			if (!isLogin) {
				const code = codeGenerator();
				const map = new Map();
				AsyncStorage.setItem('userId', userCredentials.user.uid.toString());
				map.set('id', userCredentials.user.uid.toString());
				map.set('name', name.toString());
				map.set('email', email.toString());
				map.set('code', code.toString());
				map.set('groups', [code.toString()]);

				const userDataStringfy = JSON.stringify(Array.from(map.entries()));
				console.log('userDataStringfy', userDataStringfy);
				setUser(userDataStringfy);
				let location = await Location.getCurrentPositionAsync({});
				storeUserData(db, {
					id: userCredentials.user.uid.toString(),
					name: name.toString(),
					email: email.toString(),
					code: code.toString(),
					lat: location.coords?.latitude?.toString(),
					long: location.coords?.longitude?.toString(),
				});
				createGroup(db, {
					code: code,
					uid: userCredentials.user.uid,
				});
			}
			return true;
		} catch (e) {
			return false;
		}
	}

	function setToken(token) {
		setAuthToken(token);
		AsyncStorage.setItem('token', token);
	}

	function setUser(user) {
		AsyncStorage.setItem('user', user);
	}

	async function logout() {
		logOut(auth);
		setAuthToken(null);
		AsyncStorage.removeItem('token');
		AsyncStorage.removeItem('user');
	}

	async function fetchUsersById(userIds) {
		return await getUsersById(db, userIds);
	}

	async function updateUserById(userId, data) {
		await updateUser(db, userId, data);
	}

	async function updateGroupById(groupId, data) {
		await updateGroup(db, groupId, data);
	}

	async function fetchGroupsById(groupIds) {
		return await getGroupsById(db, groupIds);
	}

	const value = {
		token: authToken,
		isAuthenticated: !!authToken,
		authenticate: authenticate,
		logout: logout,
		setToken: setToken,
		setUser: setUser,
		fetchUsersById: fetchUsersById,
		updateUserById: updateUserById,
		updateGroupById: updateGroupById,
		fetchGroupsById: fetchGroupsById,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
