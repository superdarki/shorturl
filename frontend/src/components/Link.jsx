import React, { useState } from "react";
import { TextField, Button } from '@mui/material';
import Grid from "@mui/material/Grid2";

const api_url = "http://localhost:8000"
const reg = new RegExp(/(^$|(http(s)?:\/\/)([\w-]+\.)+[\w-]+([\w- ;,.\/?%&=]*))/);

const LinkContext = React.createContext({
    link: "", shortLink: "", submited: false, valid: true
})

export default function Link() {
    const [link, setLink] = useState("")
    const [shortLink, setShortLink] = useState("")
    const [submited, setSubmit] = useState(false)
    const [valid, setValid] = useState(true);

    const handleInput = async event  => {
        setLink(event.target.value)
        setValid(true)
    }

    const handleSubmit = async () => {
        if (reg.test(link)) {
            setValid(true)
            setSubmit(true)
            const response = await fetch(api_url + "/create?url=" + link, {method: "POST"})
            const json = await response.json()
            setShortLink(json.data.short)
        } else {
            setValid(false)
        }
    }

    const goBack = async () => {
        setSubmit(false)
        setLink("")
        setShortLink("")
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
                        hiddenLabel
                        fullWidth
                        id="link-to-shorten"
                        variant="outlined"
                        value={link}
                        error={!valid}
                        text
                        onChange={handleInput}
                        onSubmit={handleSubmit}
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
                        hiddenLabel
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