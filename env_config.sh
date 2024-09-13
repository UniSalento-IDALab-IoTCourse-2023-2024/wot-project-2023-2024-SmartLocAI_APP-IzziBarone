#!/bin/bash

# Carica le variabili d'ambiente dal file .env
set -a
source .env
set +a

echo $HOST_ORACLE_IP
echo $HOST_ORACLE_URL

# Sostituisce il placeholder nel file XML con il valore della variabile d'ambiente usando '|' come delimitatore
sed -i "s|HOST_ORACLE_IP|${HOST_ORACLE_IP}|g" ./android/app/src/main/res/xml/network_security_config.xml
