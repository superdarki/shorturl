import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const api_url = window._env_.API_URL;

export default function Redirect() {
    const { id } = useParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${api_url}/${id}`, { method: 'GET' })
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