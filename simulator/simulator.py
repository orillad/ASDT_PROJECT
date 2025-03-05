import json
from websockets.sync.client import connect
import time
import random
import string
import sys

def generate_sn():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=14))

def createDrone(sn):
    drone = {
        "driverLocation": {
            "distance": 0,
            "lat": 37.175883884394835,
            "lon": -3.6084380728216963
        },
        "droneLocation": {
            "aHeight": 326,
            "distance": 0,
            "fHeight": 0,
            "lat": random.uniform(41.70, 41.75),
            "lon": random.uniform(1.80, 1.95)
        },
        "flightID": "",
        "flightPurpose": "",
        "homeLocation": {
            "distance": 0,
            "lat": 37.18484225272333,
            "lon": -3.5940185185256746
        },
        "mac": "",
        "name": "Mavic Air 2S",
        "operatorId": "",
        "pitch": 0,
        "productId": 66,
        "productType": "",
        "reliability": 100,
        "roll": 0,
        "signalPower": 240,
        "signalType": 1,
        "sn": sn,
        "uid": random.randint(1000000000000000000, 9999999999999999999),
        "vendor": "",
        "vx": 0,
        "vy": 0,
        "vz": 0
    }
    print("lat: ", drone["droneLocation"]["lat"])
    print("lon: ", drone["droneLocation"]["lon"])
    return drone

def sendDrone(websocket):
    while True:
        sn = generate_sn()
        for _ in range(4):  
            try:
                websocket.send(json.dumps(createDrone(sn)))
                message = websocket.recv()  
                print(f"Drone sent with SN: {sn}")
            except websocket.exceptions.ConnectionClosedError as e:
                print(f"Connection closed with error: {e}")
                break
            time.sleep(5)

def main():
    with connect("ws://localhost:8080") as websocket:
        print("Connexió establerta.")
        sendDrone(websocket)

if __name__ == "__main__":
    main()
