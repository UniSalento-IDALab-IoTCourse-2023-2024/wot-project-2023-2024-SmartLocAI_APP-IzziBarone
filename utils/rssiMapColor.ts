export const getRSSIColor = (rssi: number) => {
    const maxRSSI = -30;  // Segnale eccellente
    const minRSSI = -90;  // Segnale molto debole
    const normalizedRSSI = Math.min(Math.max((rssi - minRSSI) / (maxRSSI - minRSSI), 0), 1);
    const red = Math.floor(255 * (1 - normalizedRSSI));
    const green = Math.floor(255 * normalizedRSSI);
    return `rgb(${red},${green},0)`;
};
