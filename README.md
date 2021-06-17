﻿# FredigoNans_6_12062021
----------------------------
#Architecture du backend
----------------------------
server.js          
    |           
    |--- app.js ------------------------> Point d'entrée de l'application            
           |---------- controllers ------------> Contrôleurs de route express pour tous les points de terminaison de l'application            
           |---------- config -----------------> Variables d'environnement et de configuration             
           |---------- middleware ------------> Logique métier                
           |---------- models -----------------> Schémas utilisés par la base de donnée                 
           |---------- routes -----------------> Routes utilisées par l'application                        

----------------------------
#Dépendances
-------------------------------
|Middleware ou module|Actions|
|:-------------------------:|-----------------------------------|
|bcrypt|  Cryptage des mots de passe utilisateurs|
|bodyparser| Middleware d'analyse des requêtes|
|express | Infrastructure d'applications Web Node.js|
|express-mongo-sanitize | Middleware qui nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB|
|express-rate-limit | Middleware qui limite le nombre de requêtes sur une durée defini pour chaque adresse ip|
|helmet | Aide à sécuriser les applications Express en définissant divers headers HTTP|
|jsonwebtoken | Création de tokens pour une authentification sécurisé|
|mongoose | Sert de passerelle entre notre serveur Node.js et notre serveur MongoDB|
|mongoose-unique-validator | Vérification que l'email utilisateur est unique et n'est pas dans la base de donnée|
|multer | Middleware utiliser pour télécharger les images ajoutées par les utilisateur|
|password-validator | Vérifie que le mot de passe utilisateur est sécurisé.</br>Format : -Minimum 8 caractères</br>-Maximum 100 caractères</br>-Minimum une majuscule</br>-Minimum une minuscule</br>-Minimum un chiffre</br>-Minimum un caractère spécial |

----------------------------------------

#Compétences évaluées
----------------------------

Mettre en œuvre des opérations CRUD de manière sécurisée.
Stocker des données de manière sécurisée.
Implémenter un modèle logique de données conformément à la réglementation.
