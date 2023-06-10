import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function GroupsMapScreen({ route, navigation }) {
	const { ownerDetails, membersDetails } = route?.params;
	const [mapRegion, setMapRegion] = useState(null);

	useEffect(() => {
		console.log('ownerDetails', ownerDetails);
		console.log('membersDetails', membersDetails);

		const calculateZoomLevel = () => {
			const { width, height } = Dimensions.get('window');
			const zoomLevelPercentage = 2;
			const latitudeDelta =
				(360 / (Math.pow(2, 15) * (zoomLevelPercentage / 100))) *
				(height / 256);
			const longitudeDelta = latitudeDelta * (width / height);
			setMapRegion({
				latitude: ownerDetails?.lat ?? 37.78,
				longitude: ownerDetails?.long ?? -122.43,
				latitudeDelta,
				longitudeDelta,
			});
		};

		calculateZoomLevel();
	}, [ownerDetails]);

	return (
		<View style={styles.container}>
			{mapRegion && (
				<MapView style={styles.map} initialRegion={mapRegion} onPress={null}>
					{membersDetails?.length > 0 &&
						membersDetails.map((member, index) => {
							return (
								<Marker
									key={index}
									title={member.name}
									coordinate={{
										latitude: parseFloat(member.lat) ?? 37.78,
										longitude: parseFloat(member.long) ?? -122.43,
									}}
									pinColor={member.id === ownerDetails.id ? 'blue' : 'red'}
								/>
							);
						})}
				</MapView>
			)}
		</View>
	);
}

const styles = {
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
};
