# Gewerk-Bilder

Hier liegen die flächenfüllenden Bilder pro Gewerk. Lege je ein quadratisches
Bild (1:1) mit dem **Gewerk-Slug** als Dateinamen ab. Sobald die Datei vorhanden
ist, ersetzt sie automatisch die farbige Platzhalterfläche – kein Code-Eingriff
nötig (siehe `lib/gewerke-bilder.ts`).

Erlaubte Endungen: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`

Erwartete Dateinamen:

| Datei              | Gewerk        |
| ------------------ | ------------- |
| `bodenleger.jpg`   | Bodenleger    |
| `maler.jpg`        | Maler         |
| `fliesenleger.jpg` | Fliesenleger  |
| `trockenbau.jpg`   | Trockenbau    |
| `sanitaer.jpg`     | Sanitär       |
| `elektro.jpg`      | Elektro       |
| `tischler.jpg`     | Tischler      |
| `dachdecker.jpg`   | Dachdecker    |
| `garten.jpg`       | Garten        |
| `material.jpg`     | Material      |

Empfehlung: mit Adobe Firefly erzeugen (kommerziell nutzbar), Seitenverhältnis
1:1, Inhaltstyp „Foto". Die Bilder werden quadratisch beschnitten (`object-cover`).
