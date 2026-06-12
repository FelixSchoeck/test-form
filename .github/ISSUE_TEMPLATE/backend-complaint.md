---
name: Backend Complaint
about: Beschwerde vom Backend-Team über Frontend-Daten
title: '⚠️ Dauerhaft fehlerhafte Daten vom Frontend-Formular'
labels: ['bug', 'frontend', 'urgent']
assignees: ''

---

## Beschreibung

Seitdem das neue Kontaktformular live ist, bekommen wir vom Frontend ständig **unbrauchbare Daten** in die API. Ich bin es leid, ständig den Müll zu putten, der da ankommt. Das kann so nicht weitergehen!

## Beispiele für eingegangene Daten

```json
{
  "name": "",
  "email": "keine-email",
  "age": "fünfzehn",
  "zip": "abcde",
  "password": "1234",
  "message": "<script>alert('hacked')</script>",
  "anliegen": "",
  "agb": "rejected",
  "newsletter": "yes"
}
```

```json
{
  "name": "A".repeat(10000),
  "email": null,
  "age": "-5",
  "zip": "99999999999999999999",
  "password": "",
  "message": "",
  "anliegen": "Bitte wählen",
  "agb": "accepted",
  "newsletter": "no"
}
```

```json
{
  "name": "<script>window.location='https://evil.com'</script>",
  "email": "../../../etc/passwd",
  "age": "1e309",
  "zip": "null",
  "password": "hunter2",
  "message": "".repeat(500000),
  "anliegen": "undefined",
  "agb": "maybe",
  "newsletter": "true"
}
```

## Probleme aus Backend-Sicht

1. **Keine Validierung** – Es wird literally jeder Rotz akzeptiert. SQL Injection, XSS, Buffer Overflows – alles dabei.
2. **Falsche Datentypen** – `age` sollte eine Zahl sein, kommt aber als String "fünfzehn" an. `zip` soll 5-stellig sein, kommt aber "abcde".
3. **Leere Pflichtfelder** – Name und E-Mail sind oft leer. Was soll ich damit?
4. **AGB wird als String "accepted"/"rejected" gesendet** – warum nicht als Boolean? Wer zur Hölle hat das designed?
5. **Newsletter-Doppelbelegung** – Es kommen zwei newsletter-Felder im Body an, weil im HTML zwei Checkboxen dieselbe ID haben.
6. **Keine Input Limits** – 10.000 Zeichen im Name-Feld? Wirklich? Unser Backend kriegt regelmäßig Timeouts.
7. **XSS Payloads im Klartext** – Das Frontend filtert nichts. Wir leiten die Daten nur weiter, aber das ist ein Sicherheitsrisiko.
8. **Passwort im Klartext in localStorage** – Habe ich im Code gesehen. Ein Albtraum für den Pentest.

## Anforderungen

- [ ] Bitte **ENDLICH** eine Validierung einbauen
- [ ] Typprüfung für Zahlenfelder (age, zip)
- [ ] Maximale Längen für Strings
- [ ] Boolean für AGB statt String-Compare
- [ ] Keine duplizierten IDs im HTML
- [ ] XSS-Sanitisierung
- [ ] Kein localStorage für Passwörter
- [ ] Ordentliches Error-Handling bei API-Calls

## Sonstiges

Wenn das nicht bald gefixt wird, eskalier ich das an den Lead. So kann man keine stabile Anwendung betreiben.

/cc @tech-lead
