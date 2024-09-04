import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const api_url = process.env.REACT_APP_API_URL;

export default function Redirect() {
    const { id } = useParams();

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
        });
    }, [id]);

    return null;
}