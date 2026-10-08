# Farben – Baumarkt Niederrhein

Übersicht aller Farben im Projekt (Stand: 08.10.2026).

## 1. Design-Tokens aus Figma

Quelle: Figma „Bodenbeläge Niederrhein“, Knoten `107:3090`.
Definiert in `app/globals.css` (`@theme`), nutzbar als Tailwind-Klassen.

| Figma-Variable       | Hex       | Tailwind-Token           | Beispiel-Klassen                 |
|----------------------|-----------|--------------------------|----------------------------------|
| `Color/Primary`      | `#059669` | `--color-primary`        | `bg-primary`, `text-primary`     |
| `Color/Surface`      | `#ffffff` | `--color-surface`        | `bg-surface`                     |
| `Color/Dark-Surface` | `#1f1b18` | `--color-dark-surface`   | `bg-dark-surface`                |
| `Color/Text`         | `#1f1b18` | `--color-text`           | `text-text`                      |
| `Color/Text-Muted`   | `#998f85` | `--color-text-muted`     | `text-text-muted`                |
| `Color/Stroke`       | `#e5e7eb` | `--color-stroke`         | `border-stroke`                  |

> Hinweis: Die Tokens sind angelegt, werden in den Komponenten aber noch nicht verwendet.

## 2. Basisfarben (CSS-Variablen)

Definiert in `app/globals.css` (`:root`).

| Variable       | Hex       | Verwendung                      |
|----------------|-----------|---------------------------------|
| `--background` | `#ffffff` | Seitenhintergrund (`bg-background`) |
| `--foreground` | `#1c1917` | Standard-Textfarbe (`text-foreground`, = stone-900) |

## 3. Aktuell genutzte Tailwind-Farben

Werden direkt als Tailwind-Klassen in `app/` und `components/` verwendet.
Hex-Werte sind Näherungen (Tailwind v4 definiert die Farben in OKLCH).

### Neutral (Stone)

| Klasse      | Hex       | Häufigkeit | Typische Verwendung                     |
|-------------|-----------|-----------:|-----------------------------------------|
| `stone-50`  | `#fafaf9` | 7  | helle Flächen                           |
| `stone-100` | `#f5f5f4` | 9  | Hintergründe, Hover                     |
| `stone-200` | `#e7e5e4` | 15 | Rahmen, Trennlinien                     |
| `stone-300` | `#d6d3d1` | 5  | Rahmen (z. B. Gewerk-Pills)             |
| `stone-500` | `#78716c` | 17 | Sekundärtext, Breadcrumb                |
| `stone-600` | `#57534e` | 10 | Fließtext, Untertitel                   |
| `stone-700` | `#44403c` | 20 | Fließtext                               |
| `stone-800` | `#292524` | 1  | –                                       |
| `stone-900` | `#1c1917` | 31 | Überschriften, Haupttext (auch `/30`, `/50` als Overlay) |

### Akzent (Orange)

| Klasse       | Hex       | Häufigkeit | Typische Verwendung              |
|--------------|-----------|-----------:|----------------------------------|
| `orange-600` | `#ea580c` | 8  | Buttons, Icons                   |
| `orange-700` | `#c2410c` | 15 | Hover-Zustände, Links            |
| `orange-800` | `#9a3412` | 2  | Hover auf dunklen Akzenten       |

### Weiß

| Klasse                         | Hex       | Verwendung              |
|--------------------------------|-----------|-------------------------|
| `white`, `white/90`, `white/95` | `#ffffff` | Text auf Bildern, Overlays |

## 4. Gewerk-Platzhalterfarben

Definiert in `lib/gewerke.ts` (`GEWERKE_FARBEN`). Für farbige Platzhalter-Bildflächen
auf Karten und in der Detailgalerie.

| Gewerk         | Hex       |
|----------------|-----------|
| `bodenleger`   | `#B07A4F` |
| `maler`        | `#2F6FED` |
| `fliesenleger` | `#0E9594` |
| `trockenbau`   | `#6B7280` |
| `sanitaer`     | `#0891B2` |
| `elektro`      | `#D97706` |
| `tischler`     | `#92400E` |
| `dachdecker`   | `#B91C1C` |
| `garten`       | `#15803D` |
| `material`     | `#475569` |
| *Fallback*     | `#64748B` |

## 5. Social-Media-Bild (OG-Image)

Definiert in `app/opengraph-image.tsx`.

| Verwendung              | Hex                       |
|-------------------------|---------------------------|
| Verlauf (135°) Start    | `#EA580C` (= orange-600)  |
| Verlauf (135°) Ende     | `#E11D48` (= rose-600)    |

## Offene Punkte

- **Akzentfarbe:** Im Code ist sie Orange (`orange-600`/`700`), in Figma Grün (`#059669`).
  Für eine Umstellung müssten Buttons, Links, Icons und das OG-Image angepasst werden.
- **Textfarbe:** Im Code wird `#1c1917` (stone-900) verwendet, in Figma `#1f1b18`. Die beiden sind fast identisch.
- **Rahmen:** Im Code wird `stone-200` (`#e7e5e4`) verwendet, in Figma `#e5e7eb` (gray-200).
