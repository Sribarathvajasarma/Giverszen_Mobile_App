import { Alert } from "react-native"
export const initialState = {
    isLoading: true,
    listings: [],
}

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case "LISTING_INIT":
            return {
                listings: payload,
                isLoading: false,
            }
        case "ADD_LISTING":
            if (payload.type === 'nonfood') {
                payload.expires_in = '2022-9-28 13:24:44'
            }
            fetch("https://giverzenbackend.herokuapp.com/api/add_listings", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    poster_id: payload.poster_id,
                    name: payload.name,
                    description: payload.description,
                    quantity: payload.quantity,
                    longitude: payload.longitude,
                    latitude: payload.latitude,
                    avatar: payload.avatar,
                    expires_in: payload.expires_in,
                    type: payload.type,
                    phone: payload.phone
                })
            }).then((response) => response.json()).then(async (responseData) => {
                console.log(responseData)
                if (responseData.code === 1) {
                    Alert.alert('Listing added succesfully')
                } else {
                    Alert.alert('Sorry unable to add listing, Please try again')
                }
            }).done();
            return { listings: [...state.listings, payload], isLoading: false }
    }
}