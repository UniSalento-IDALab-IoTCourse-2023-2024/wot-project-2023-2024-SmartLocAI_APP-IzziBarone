export type FingerprintScan = {
    wifiDatas: WifiScan[];
    bluetoothDatas: BluetoothScan[];
}
export type WifiScan = {
    SSID: string,
    RSSI: number
};
export type BluetoothScan = {
    SSID: string,
    RSSI: number
};
