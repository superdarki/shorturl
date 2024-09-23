# CSC 8567 - Projet : shorturl

### Schéma de la base de données
![BDD Scheme](db_scheme.jpg)

### Schéma de l'infrastructure
![Docker Scheme](docker_scheme.jpg)

Statut de build des images :
[![Publish Docker image](https://github.com/superdarki/shorturl/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/superdarki/shorturl/actions/workflows/docker-publish.yml)

### Routes de l'application

- `/` : la partie visuelle du frontend n'utilise que cet endpoint
- `/<id:string>` : gère les redirections des url raccourcies
- `/api/`