import React, { useEffect, useState } from "react";

const LinksContext = React.createContext({
    links: [], fetchLinks: () => {}
})

export default function Links() {
    const [links, setLinks] = useState([])
    const fetchLinks = async () => {
      const response = await fetch("http://localhost:8000/links")
      const links = await response.json()
      setLinks(links.data)
    }

    useEffect(() => {
        fetchLinks()
    }, [])
      
    return (
        <LinksContext.Provider value={{links, fetchLinks}}>
            {links.map((link) => (
                <b>{link.short} : {link.origin}</b>
            ))}
        </LinksContext.Provider>
    )
}