import { createContext, useState } from "react";
import { TextField, Button } from '@mui/material';
import Grid from "@mui/material/Grid2";

const api_url = window._env_.API_URL
const reg = /(^$|(http(s)?:\/\/)(localhost|([\w-]+\.)+[\w-]+)(:\d+)?([\w- ;,./?%&=]*))/;

const LinkContext = createContext({
    link: "", shortLink: "", submited: false, valid: true
})

export default function Link() {
    const [link, setLink] = useState("")
    const [shortLink, setShortLink] = useState("")
    const [submited, setSubmit] = useState(false)
    const [valid, setValid] = useState(true);

    async function handleInput(event) {
        setLink(event.target.value);
        setValid(true);
    }

    async function handleSubmit() {
        if (link && reg.test(link)) {
            setValid(true);
            setSubmit(true);
            const response = await fetch(api_url + "/create?url=" + encodeURIComponent(link), {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error('Request failed');
            }            
            const json = await response.json();
            setShortLink(window.location.origin + window.location.pathname + json.id);
        } else {
            setValid(false);
        }
    }

    async function goBack() {
        setSubmit(false);
        setLink("");
        setShortLink("");
    }
    
    if (!submited) {
        return (
            <LinkContext.Provider value={{link, shortLink, submited, valid}}>
                <Grid 
                    size="grow"
                    display="flex"
                    justifyContent="center"
                >
                    <TextField
                        label="Enter the link to shorten"
                        fullWidth
                        id="link-to-shorten"
                        variant="outlined"
                        value={link}
                        error={!valid}
                        text
                        onChange={handleInput}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                handleSubmit()
                                ev.preventDefault()
                            }
                        }}
                    />
                </Grid>
                <Grid 
                    size="auto"
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Go
                    </Button>
                </Grid>
            </LinkContext.Provider>
        )
    } else {
        return (
            <LinkContext.Provider value={{link, shortLink, submited, valid}}>
                <Grid 
                    size="grow"
                    display="flex"
                    justifyContent="center"
                >
                    <TextField
                        label="Your link :"
                        fullWidth
                        value={shortLink}
                        id="short-link"
                        variant="outlined"
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />
                </Grid>
                <Grid 
                    size="auto"
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        onClick={goBack}
                    >
                        Back
                    </Button>
                </Grid>
            </LinkContext.Provider>
        )
    }
}