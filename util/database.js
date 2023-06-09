import {
	collection,
	query,
	getDocs,
	doc,
	setDoc,
	where,
	updateDoc,
} from 'firebase/firestore';

export async function getUsersList(db) {
	const querySnapshot = await getDocs(collection(db, 'users'));

	const users = [];

	querySnapshot.forEach((doc) => {
		console.log(`${doc.id} => ${doc.data()}`);
		const data = doc.data();
		users.push({
			id: doc.id,
			name: data.name,
			code: data.code,
			email: data.email,
			lat: data.lat,
			long: data.long,
			groups: data.groups,
		});
	});

	return users;
}

export async function getGroupsList(db) {
	const querySnapshot = await getDocs(collection(db, 'groups'));

	const groups = [];

	querySnapshot.forEach((doc) => {
		console.log(`${doc.id} => ${doc.data()}`);
		const data = doc.data();
		groups.push({
			code: doc.id,
			owner: data.owner,
			members: data.members,
		});
	});

	return groups;
}

export async function getUsersById(db, userIds) {
	const users = [];
	try {
		const q = query(collection(db, 'users'), where('__name__', 'in', userIds));
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			if (doc.exists()) {
				const data = doc.data();
				users.push({
					id: doc.id,
					name: data.name,
					code: data.code,
					email: data.email,
					lat: data.lat,
					long: data.long,
					groups: data.groups,
				});
			}
		});

		console.log('Fetched documents: ', users);
	} catch (e) {
		console.error('Error fetching documents: ', e);
	} finally {
		return users;
	}
}

export async function getGroupsById(db, groupIds) {
	const groups = [];
	try {
		const q = query(
			collection(db, 'groups'),
			where('__name__', 'in', groupIds)
		);
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			if (doc.exists()) {
				const data = doc.data();
				groups.push({
					code: doc.id,
					owner: data.owner,
					members: data.members,
				});
			}
		});

		console.log('Fetched documents: ', groups);
	} catch (e) {
		console.error('Error fetching documents: ', e);
	} finally {
		return groups;
	}
}

export async function storeUserData(db, userData) {
	try {
		const id = userData.id?.toString();
		console.log('values', id);
		const docRef = await setDoc(doc(db, 'users', id), {
			name: userData.name,
			email: userData.email,
			lat: '',
			long: '',
			code: userData.code,
			groups: [userData.code],
		});

		console.log('Document written with ID: ', docRef);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export async function createGroup(db, groupData) {
	try {
		const id = groupData.code;
		console.log('values', id);
		const docRef = await setDoc(doc(db, 'groups', id), {
			owner: groupData.uid,
			members: [groupData.uid],
		});

		console.log('Document written with ID: ', docRef);
	} catch (e) {
		console.error('Error adding document: ', e);
	}
}

export async function updateUser(db, userId, userData) {
	const documentRef = doc(db, 'users', userId);

	try {
		await updateDoc(documentRef, {
			...userData,
		});
		console.log('Document updated successfully');
	} catch (error) {
		console.error('Error updating document: ', error);
	}
}

export async function updateGroup(db, groupId, groupData) {
	const documentRef = doc(db, 'groups', groupId);

	try {
		console.log('updateGroup', groupData);
		await updateDoc(documentRef, {
			...groupData,
		});
		console.log('Document updated successfully');
	} catch (error) {
		console.error('Error updating document: ', error);
	}
}
