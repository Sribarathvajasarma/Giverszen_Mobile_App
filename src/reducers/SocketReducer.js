export const initialState = []

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SOCKET_INIT":
            return {
                payload
            }
        default:
            return state
    }
}