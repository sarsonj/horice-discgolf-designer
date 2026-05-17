# Discgolf Designer — Sochařský park Gotthard, Hořice

Webová aplikace pro návrh layoutu discgolfového hřiště v Sochařském parku u sv. Gotharda v Hořicích, vytvořená pro participativní rozpočet města 2026.

🌐 **Live demo: https://sarsonj.github.io/horice-discgolf-designer/**

## Funkce

- Interaktivní mapa s ortofotem (Esri, ČÚZK)
- 139 soch ze sochařských sympozií jako referenční body (zdroj: OSM/Wikidata)
- 432 katastrálních parcel obou parků s odkazem na Nahlížení do KN (ČÚZK)
- Hranice parku z OpenStreetMap
- Návrh jamek (odpaliště + koš) s drag-and-drop a přesnou editací GPS
- Bezpečnostní zóny kolem soch (přepínatelné)
- Více variant návrhů (Parklife původní + vlastní)
- **Mobilní verze** s GPS trackingem a funkcí "Použít moji polohu"
- Export/import JSON, KML, GPX
- Auto-save do localStorage prohlížeče

## Lokální použití

Stáhni `index.html` a otevři v prohlížeči. Pro GPS funkce na mobilu je potřeba HTTPS — proto je nasazené na GitHub Pages.

## Data

Aplikace je single-file HTML s vestavěnými daty. Žádný backend. Žádné cookies. Veškerá uživatelská data zůstávají v localStorage prohlížeče.
