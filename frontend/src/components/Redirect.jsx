import { useEffect, useState } from 'react';

const api_url = window._env_.API_URL;
const app_path = window._env_.APP_PATH;

export default function Redirect() {
    const [error, setError] = useState(null);

    const id = window.location.pathname.replace(app_path, '').replace(/^\/+|\/+$/g, '')

    useEffect(() => {
        fetch(`${api_url}/${id}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then((url) => {
                const cleanedUrl = url.replace(/^"|"$/g, '').trim();
                window.location.href = cleanedUrl;
            })
            .catch((error) => {
                console.error('Error fetching the redirect URL:', error);
                setError(error);
            });
    }, [id]);

    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    return <div>Loading...</div>;
}