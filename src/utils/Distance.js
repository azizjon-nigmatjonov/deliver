export const Distance = (data) => {
    if (data >= 1000) {
        return `${data / 1000 || "0"} km`
    } else {
        return `${data || "0"} m`
    }
}
