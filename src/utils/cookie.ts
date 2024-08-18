export function getCookie(name: string): string | null {
    // Check if the code is running in a browser environment
    if (typeof document !== 'undefined') {
        const value = `; ${document.cookie}`; // Add a leading semicolon for consistent parsing
        const parts = value.split(`; ${name}=`); // Split the cookies string by the name
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null; // Return the value part of the cookie
        }
    }
    return null; // Return null if the cookie is not found or if running on the server
}
