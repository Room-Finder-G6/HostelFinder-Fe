const API_KEY = process.env.NEXT_PUBLIC_GOONG_API_KEY;
const API_BASE_URL = 'https://rsapi.goong.io'; // Assuming this is the base URL for Goong API

export const placeService = {
    async autocomplete(input: string) {
        const response = await fetch(`${API_BASE_URL}/Place/AutoComplete?api_key=${API_KEY}&input=${encodeURIComponent(input)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },

    async getPlaceDetails(placeId: string) {
        const response = await fetch(`${API_BASE_URL}/Place/Detail?api_key=${API_KEY}&place_id=${placeId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
};