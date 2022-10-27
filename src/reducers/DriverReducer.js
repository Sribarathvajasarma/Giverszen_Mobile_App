export const initialState = {
    drivers: [],
}

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case "DRIVER_INIT":
            return {
                drivers: payload,
            }
    }
}