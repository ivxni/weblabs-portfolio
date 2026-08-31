# =============================================================================
# Mehrstufiger Build für das Portfolio
# =============================================================================
# Ziel: ein Image, das nur enthält, was zur Laufzeit gebraucht wird. Der
# fertige Runner liegt bei rund 200 MB statt bei über einem Gigabyte, den ein
# einstufiger Build mit vollständigem node_modules erzeugen würde.

# ---- 1. Abhängigkeiten ------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Nur die Manifeste kopieren, nicht das Projekt. Solange sich package.json und
# package-lock.json nicht ändern, kommt diese Schicht aus dem Cache — das ist
# der Unterschied zwischen 15 Sekunden und drei Minuten pro Deployment.
COPY package.json package-lock.json ./

# `npm ci` statt `npm install`: installiert exakt die Versionen aus dem
# Lockfile und schlägt fehl, wenn Lockfile und package.json auseinanderlaufen.
# Ein Build, der still eine andere Version zieht als lokal getestet, ist die
# unangenehmste Sorte Fehler.
RUN npm ci


# ---- 2. Build ---------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

ARG GOOGLE_SITE_VERIFICATION=""
ENV GOOGLE_SITE_VERIFICATION=$GOOGLE_SITE_VERIFICATION

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js sammelt standardmäßig anonyme Nutzungsdaten. Auf einem Buildserver
# ist das weder gewollt noch nützlich.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Dieser Schritt braucht Netzwerk: `next/font/google` lädt die Schriftdateien
# zur Bauzeit herunter und legt sie ins Bundle. Zur LAUFZEIT spricht die Seite
# dann nie mit Google — genau das verlangt die Datenschutzerklärung.
RUN npm run build


# ---- 3. Laufzeit ------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Eigener Benutzer statt root. Ein Prozess, der im Container root ist, ist bei
# einem Ausbruch auch auf dem Host privilegiert — und ein Next.js-Server
# braucht keinerlei erhöhte Rechte.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# `output: 'standalone'` erzeugt einen Server, der seine Abhängigkeiten bereits
# gebündelt mitbringt. Deshalb wird hier KEIN node_modules kopiert.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Der Healthcheck fragt die eigene API. Ohne ihn gilt ein Container als gesund,
# sobald der Prozess läuft — auch wenn Next.js noch gar nicht antwortet, und
# Coolify würde eine kaputte Version übernehmen.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
