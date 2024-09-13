

# SmartLocAI - Android Application

**Android Application** di **SmartLocAI** è l'applicazione coinvolta nella raccolta e nel *pre-processing* dei dati provenienti dagli access-point WI-FI e BLE Beacon dell'ambiente in cui si vuole eseguire la localizzazione. 
L'applicazione si interfaccia direttamente col cloud per inviare dati relativi al **fingerprint** dell'ambiente e per **testare** i modelli, oltre a garantire una visualizzazione interattiva della posizione corrente.

## Tecnologie e librerie utilizzate
L'applicazione è stata sviluppata usando il framework **React-Native** che mette a disposizione librerie utili per l'accesso ai dati WI-FI e Bluetooth.
### WiFi Reborn
react-native-wifi-reborn è una libreria per React Native che permette di gestire le reti WiFi su dispositivi Android e iOS. Consente di scansionare, connettere e gestire le reti WiFi in modo programmatico all'interno della tua applicazione.

Funzionalità principali:

Scansione delle reti WiFi disponibili.
Connessione a specifiche reti WiFi.
Recupero delle informazioni sulla rete attualmente connessa.
### BLE Manager
react-native-ble-manager è una libreria Bluetooth Low Energy (BLE) per React Native che consente alla tua app di scansionare, connettere e comunicare con i dispositivi BLE periferici.

Funzionalità principali:

Scansione dei dispositivi BLE nelle vicinanze.
Connessione e gestione delle periferiche BLE.
Interazione con i servizi e le caratteristiche dei dispositivi BLE collegati.

IMPORTANTE!: l'applicazione è sviluppata per essere fruibile visivamente su display tablet.

## Come iniziare (ANDROID ONLY)

1. Clonazione del repository
```sh
git clone https://github.com/UniSalento-IDALab-IoTCourse-2023-2024/wot-project-2023-2024-SmartLocAI_APP-IzziBarone.git
```
2a. E' possibile scaricare la versione APK dell'applicazione presente nella directory:
```sh
android/app/build/outputs/apk/release/app-release.apk
```
2b. Environment:
```env
HOST_ORACLE_IP=***
HOST_ORACLE_URL=***
```
## Screen Views
![Homepage](https://drive.google.com/uc?export=view&id=1wUTTepSxKWxn1Dz4aHmSbRPJJUhKgB4U)
![Coordinates input](https://drive.google.com/uc?export=view&id=1-v3fgM1dKiH5IqGheDSzunHAyKC_V5-J)
![Scan Screen](https://drive.google.com/uc?export=view&id=14XiRQV90EH8TYEDhpaNourQ5AAzzqs5o)


