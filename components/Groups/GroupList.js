import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { Colors } from '../../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function GroupList({ data, onPressHandler }) {
	function GroupTile({ item }) {
		return (
			<Pressable
				onPress={() => {
					onPressHandler(item);
				}}
				style={({ pressed }) => [
					styles.groupTileContainer,
					{ backgroundColor: pressed ? Colors.primary700 : Colors.primary500 },
				]}>
				<LinearGradient
					colors={[Colors.primary500, Colors.primary700]}
					style={styles.gradientContainer}>
					<Text style={styles.groupCodeText}>Group Code:</Text>
					<Text style={styles.groupCodeValue}>{item.code}</Text>
					<Text style={styles.groupOwnerText}>Group Owner:</Text>
					<Text style={styles.groupOwnerValue}>{item.owner}</Text>
					<Text style={styles.totalMembersText}>Total Members:</Text>
					<Text style={styles.totalMembersValue}>{item.members.length}</Text>
				</LinearGradient>
			</Pressable>
		);
	}

	return (
		<FlatList
			data={data}
			renderItem={GroupTile}
			keyExtractor={(item, index) => item.code}
		/>
	);
}

const styles = StyleSheet.create({
	groupTileContainer: {
		borderRadius: 10,
		marginBottom: 10,
		margin: 10,
		overflow: 'hidden',
	},
	gradientContainer: {
		padding: 20,
	},
	groupCodeText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
		marginBottom: 5,
	},
	groupCodeValue: {
		color: '#FFC3E5',
		fontWeight: 'bold',
		fontSize: 20,
	},
	groupOwnerText: {
		color: '#FFE098',
		fontWeight: 'bold',
		fontSize: 16,
		marginTop: 10,
	},
	groupOwnerValue: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
	},
	totalMembersText: {
		color: '#FFC3E5',
		fontWeight: 'bold',
		fontSize: 16,
		marginTop: 10,
	},
	totalMembersValue: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
	},
});
