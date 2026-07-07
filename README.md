# HR-OS — Hiring Loop System

System do automatyzacji rekrutacji: agenci AI robią rutynę (screening CV, ranking, onboarding), a człowiek podejmuje decyzje. Produkt sprzedażowy / portfolio.

## Apka (PWA)

Instalowalna na telefonie i komputerze:

- **Live:** https://emiliaszymura-collab.github.io/hr-os/
- Główna scena: `hr-os.html` (interaktywne biuro 3D z agentami — Three.js)
- `index.html` przekierowuje na `hr-os.html`
- `manifest.json` + `sw.js` + ikony → instalacja i tryb offline

### Instalacja
- **iPhone (Safari):** Udostępnij → „Do ekranu początkowego"
- **Android (Chrome):** ⋮ → „Zainstaluj aplikację"
- **Komputer (Chrome/Edge):** ikona instalacji w pasku adresu → „Zainstaluj"

## Pliki
- `hr-os.html` — hero / scena 3D biura HR
- `hr-office-3d.html` — dashboard 3D (INBOX CV, klikalni agenci)
- `hr-os-cloud.html` — ATS w chmurze (Supabase, upload CV PDF/Word, scoring AI)
- `hr-os-oferta.html` — oferta sprzedażowa
- `hr-os-sprzedaz.md` — materiały sprzedażowe
- `hr-os-n8n-auto-shortlist.json` — workflow n8n (silnik scoringu: Webhook → RODO → Claude → JSON)

## Model biznesowy
Rynek: agencje rekrutacyjne. Model: usługa „done-for-you" + abonament.
MVP = workflow „Auto-Shortlist": wiele CV → ranking top kandydatów z uzasadnieniem; człowiek decyduje (RODO art. 22, AI Act).
