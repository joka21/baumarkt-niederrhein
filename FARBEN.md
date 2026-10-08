# Farben und Schriften – Baumarkt Niederrhein

Stand: 08.10.2026. Verbindlicher Standard sind die Figma-Tokens aus
„Bodenbeläge Niederrhein“ (Startseite Desktop `1:2`, Mobil `129:1894`).
Definiert in `app/globals.css`. Direkte Tailwind-Farben wie `stone-*` oder
`orange-*` werden nicht mehr verwendet.

## 1. Farben

| Figma-Variable            | Hex       | Token                       | Verwendung                              | Beispiel-Klassen                   |
|---------------------------|-----------|-----------------------------|-----------------------------------------|------------------------------------|
| `Color/Primary`           | `#059669` | `--color-primary`           | Buttons, Links, Icons, Akzente          | `bg-primary`, `text-primary`       |
| `Color/Surface`           | `#ffffff` | `--color-surface`           | Flächen                                 | `bg-surface`, `text-surface`       |
| `Color/Dark-Surface`      | `#1f1b18` | `--color-dark-surface`      | dunkle Flächen (Fußzeile, Betriebe-Box) | `bg-dark-surface`                  |
| `Color/Text`              | `#1f1b18` | `--color-text`              | Überschriften und Fließtext             | `text-text`                        |
| `Color/Text-Muted`        | `#998f85` | `--color-text-muted`        | nur kurze Zusatzangaben, nie Fließtext  | `text-text-muted`                  |
| `Color/Stroke`            | `#e5e7eb` | `--color-stroke`            | Rahmen und Trennlinien                  | `border-stroke`, `divide-stroke`   |
| `Color/Secondary`         | `#ddfce6` | `--color-secondary`         | Check-Kreise in der TeamKarte           | `bg-secondary`                     |
| `Color/Text-On-Secondary` | `#27500a` | `--color-text-on-secondary` | Text auf `secondary` (derzeit ungenutzt) | `text-text-on-secondary`          |

In Figma vorhanden, aber nicht als Token übernommen: `Color/Accent` `#ffa629`.

### Regeln

- Links im Fließtext: `text-primary underline underline-offset-2`.
  Buttons und Menüpunkte ohne Unterstreichung.
- Hover auf Primärflächen über Deckkraft (`hover:opacity-80/90`), nicht über eine weitere Farbe.

### Farben außerhalb der Tokens

| Stelle                              | Wert                     | Grund                                   |
|-------------------------------------|--------------------------|-----------------------------------------|
| `lib/gewerke.ts`                    | 10 Gewerk-Farben + Fallback `#64748B` | bewusst unverändert (Platzhalterbilder) |
| `app/opengraph-image.tsx`           | `rgba(255,255,255,0.18)` | halbtransparente Fläche hinter dem Logo |
| `components/TeamKarte.tsx`          | Schatten `rgba(0,0,0,0.08)` | Schattenwert aus Figma               |
| `components/AnbieterCard.tsx`, `components/CategoryBar.tsx` | `white` in SVG-Icons | Komponenten derzeit ungenutzt |

## 2. Schriften

Geladen über `next/font/google` in `app/layout.tsx` (selbst gehostet, `display: swap`).
In Komponenten keine Schriftangaben – die Zuordnung erfolgt über die Grundstile in `app/globals.css`.

| Token          | Schrift         | Geladene Schnitte  | Verwendung                                  |
|----------------|-----------------|--------------------|---------------------------------------------|
| `font-heading` | Libre Franklin  | 800                | Überschriften h1–h6                         |
| `font-body`    | Source Sans 3   | 400, 500, 600, 700 | Fließtext, Menü, Buttons, Formulare         |

Source Sans 3 600 wird für den Figma-Stil „Button“ geladen.

## 3. Schriftgrößen

Mobil gilt bis 767px, Desktop ab 768px (Tailwind `md`).

### Überschriften (Libre Franklin ExtraBold 800, Zeilenhöhe 1.1)

| Stil | Klasse    | Mobil | Desktop | Herkunft                                      |
|------|-----------|------:|--------:|-----------------------------------------------|
| h1   | `text-h1` | 34px  | 56px    | Figma (`h1-mobile`, `h1-desktop`)             |
| h2   | `text-h2` | 28px  | 44px    | Figma (`h2-mobile`, `h2-desktop`)             |
| h3   | `text-h3` | 24px  | 34px    | **nicht aus Figma** – zwischen h2 und h4 abgeleitet |
| h4   | `text-h4` | 20px  | 26px    | Figma (`h4-mobile`, `h4-desktop`)             |
| h5   | `text-h5` | 18px  | 20px    | Figma (`h5-mobile`, `h5-desktop`)             |
| h6   | `text-h5` | 18px  | 20px    | **nicht aus Figma** – gleich wie h5           |

### Text (Source Sans 3)

| Figma-Stil              | Klasse         | Größe                      | Schnitt        | Zeilenhöhe |
|-------------------------|----------------|----------------------------|----------------|-----------:|
| Body-mobile / -desktop  | `text-body`    | 16px mobil, 18px Desktop   | Regular 400    | 1.6        |
| Body_small              | `text-body-sm` | 15px                       | Medium 500     | 1.4*       |
| Nav                     | `text-nav`     | 18px                       | Medium 500     | 1          |
| Button                  | `text-button`  | 15px                       | SemiBold 600   | 1          |

\* Figma gibt `100` ohne Einheit an. Für Body_small wurde 1.4 gewählt, damit
mehrzeilige Zusatzangaben lesbar bleiben – **nicht aus Figma**.

Fließtext ist auf kleinen Bildschirmen nie kleiner als 16px.
