# Version stable
FROM node:18-alpine
ENV NODE_ENV production
# Définition du dossier de travail
WORKDIR /app/railroad/
# Copier seulement les fichiers requis pour installer les dépendances (Meilleure mise en cache des couches)
COPY package*.json ./
# Utilisation d'un cache pour accéler l'installation des dépendes déjà existences
RUN --mount=type=cache,target=/opt/result-node-app/.npm \
    npm set cache /opt/result-node-app/.npm && \
# Installation des dépendances npm de production uniquement
    npm clean-install --only=production
# Définition des permissions et copie du code source restant après l'installation des dépendances.
COPY . .
EXPOSE 8888
CMD ["npm","start"]
