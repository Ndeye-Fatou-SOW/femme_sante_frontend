# Femme Santé — Application mobile

Application mobile de **Femme Santé**, pour le suivi de la santé féminine : cycles menstruels, journal quotidien et suivi médical.

- API : [femme_sante_backend](https://github.com/Ndeye-Fatou-SOW/femme_sante_backend)

## Écrans

- Accueil
- Cycle, avec calendrier
- Journal quotidien
- Suivi médical
- Profil
- Inscription et connexion

## Technologies

React Native · Expo · React Navigation · Redux (slices) · Axios · react-native-calendars · stockage sécurisé des jetons (expo-secure-store)

Le jeton d'accès est renouvelé automatiquement lorsqu'il expire.

## Lancer le projet

Prérequis : Node.js, l'application Expo Go sur le téléphone et le backend démarré.

```bash
npm install
npx expo start
```

L'adresse de l'API se règle dans `src/constants/api.js`.

## Auteure

Ndéye Fatou SOW — Master 2 Systèmes d'Information Répartis, Université Cheikh Anta Diop de Dakar
Portfolio : https://ndeye-fatou-sow.github.io/ndeyefatousow.github.io/
