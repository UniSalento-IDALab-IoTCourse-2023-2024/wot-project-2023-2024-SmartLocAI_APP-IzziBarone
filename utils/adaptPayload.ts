import { FingerprintScan } from '../screens/scanModel';

export const adaptPayload = (
    isLocalization: boolean,
    fingerprintScan: FingerprintScan[],
    selectedSSIDs: string[],
    ssidLetterMapping: Record<string, string>,
    xCoordinate?: number,
    yCoordinate?: number,
    zone?: string
): Record<string, any> => {
    let payload: Record<string, any> = {};

    if (xCoordinate !== undefined && yCoordinate !== undefined) {
        payload.x = xCoordinate;
        payload.y = yCoordinate;
        const today = new Date();
        payload.date = today.toLocaleDateString('en-EN').replaceAll('/','-').toString();
    } else if (zone !== undefined) {
        payload.RP = zone;
    }

    payload.data = fingerprintScan.map(scan => {
        const data: Record<string, number> = {};
        const rssiValues: (number | 'N/A')[] = [];

        selectedSSIDs.forEach(ssid => {
            const wifiData = scan.wifiDatas.find(data => data.SSID === ssid);
            const bluetoothData = scan.bluetoothDatas.find(data => data.SSID === ssid);

            const rssiValue = wifiData ? wifiData.RSSI : bluetoothData ? bluetoothData.RSSI : 'N/A';
            const key = `rssi${ssidLetterMapping[ssid] || 'A'}`;

            rssiValues.push(rssiValue);

            if (rssiValue !== 'N/A') {
                data[key] = rssiValue;
            }
        });

        return rssiValues.every(value => value !== 'N/A') ? data : {};
    }).filter(data => Object.keys(data).length > 0);

    if (isLocalization) {
        payload.rssi = Object.values(payload.data[payload.data.length - 1]);
        delete payload.data;
    }

    return payload;
};
