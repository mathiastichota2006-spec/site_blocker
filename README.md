# Site Blocker

Doplněk do prohlížeče Firefoxu, který pomáhá soustředit se tím, že blokuje nechtěné weby a stránky podle klíčových slov.

## Co doplněk umí

- Blokuje celé weby, například `youtube.com`, včetně jejich subdomén.
- Blokuje stránky, jejichž adresa obsahuje zadané klíčové slovo, například `porn`, `game` nebo `video`.
- Místo zavření karty přesměruje uživatele na vlastní stránku, která jasně ukáže, že stránka byla zablokována.
- Umožňuje přidávat a odebírat blokované weby přímo z přehledného rozhraní doplňku.
- Umožňuje přidávat a odebírat blokovaná klíčová slova.
- Nabízí přepnutí mezi světlým a tmavým režimem.
- Všechny nastavené položky se ukládají lokálně a projeví se hned, bez restartu prohlížeče.

## Jak doplněk funguje

1. Do seznamu přidáš web nebo klíčové slovo, které chceš blokovat.
2. Když se pak pokusíš otevřít odpovídající stránku, doplněk načte pravidla a stránku zachytí.
3. Namísto obsahu webu se zobrazí informační stránka s upozorněním, že byl web zablokován.
4. Seznam blokovaných položek i vzhled doplňku zůstávají uložené v prohlížeči.

## Jak doplněk nainstalovat do Firefoxu

1. Otevři Firefox a přejdi na `about:debugging#/runtime/this-firefox`.
2. Klikni na **Načíst dočasné doplnění…**.
3. Vyber soubor `manifest.json` v tomto repozitáři.
4. Klikni na ikonu doplňku v liště a začni přidávat blokované weby nebo klíčová slova.

## Struktura projektu

```text
manifest.json        Konfigurace Manifest V3 pro novější verze Firefoxu
background.js        Hlavní logika blokování (webRequest + synchronizace nastavení)
popup/               Uživatelské rozhraní doplňku (záložky Weby / Klíčová slova / Nastavení)
blocked/             Stránka, která se zobrazí místo zablokovaného webu
icons/               Ikony doplňku
```

## Kontrola projektu

Doplněk lze zkontrolovat pomocí nástroje [`web-ext`](https://github.com/mozilla/web-ext):

```bash
npx web-ext lint --source-dir=.
```
