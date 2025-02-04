# BooksSharingWebsite  

## Présentation  

BooksSharingWebsite est une plateforme web permettant aux utilisateurs de partager, rechercher et discuter autour de livres. Ce projet a été développé en 2023 dans le cadre de la Licence 2 Informatique à l’Université d’Aix-Marseille par **Hadil Ladj** et **Mohamed Said Aimen Lamri**.  

L’objectif est de faciliter l’échange de livres entre lecteurs grâce à une interface intuitive et un système de gestion efficace.  

## Technologies utilisées  

### Backend  
- **Node.js** (JavaScript côté serveur)  
- **Express.js** (gestion des routes et API REST)  
- **SQLite** (base de données légère et rapide)  
- **better-sqlite3** (interface efficace pour SQLite)  
- **bcrypt** (sécurisation des mots de passe)  
- **cookie-session** (gestion des sessions utilisateur)  
- **Google Books API** (intégration automatique de livres)  

### Frontend  
- **HTML5** (structure des pages)  
- **CSS3** (mise en page et styles)  
- **Mustache.js** (templates dynamiques côté client)  

## Installation et exécution  

1. Installer les dépendances :  
   ```bash
   npm install
   ```  
2. Lancer le serveur :  
   ```bash
   npm start
   ```  
3. Accéder à l’application : **http://localhost:3000**  

## Fonctionnalités principales  

- **Authentification sécurisée** avec hachage des mots de passe (bcrypt)  
- **Partage de livres** (ajout manuel par l’utilisateur)  
- **Recherche avancée** (par titre et catégorie)  
- **Messagerie intégrée** permettant aux utilisateurs de discuter en direct via un système de chat basé sur les commentaires  
- **Gestion des sessions** avec cookie-session  
- **Accès restreint** aux fonctionnalités pour les utilisateurs non connectés  
- **Intégration des livres via l’API Google Books**  

## Routes principales  

### Authentification  
- `/login` → Connexion  
- `/register` → Inscription  
- `/logout` → Déconnexion  

### Livres  
- `/books` → Liste des livres  
- `/books/:id` → Détails d’un livre  
- `/books/:id/comment` → Commentaire sur un livre  
- `/books/share` → Partage d’un livre  

### Utilisateurs  
- `/profile/:id` → Profil utilisateur  
- `/profile/:id/edit` → Modification du profil  

