export const initialState = {
    language: "",
}

export const reducer = (state, { type, payload }) => {
    switch (type) {
        case "LANGUAGE_INIT":
            return {
                language: payload,
            }
    }
}