kittenwifi.on_wifi_disconnected(function () {
    flag = false
    basic.showLeds(`
        . # . . .
        # # . . .
        . # . # .
        . . . # #
        . . . # .
        `)
    basic.pause(30 * 1000)
})
kittenwifi.on_wifi_connected(function () {
    basic.pause(30 * 1000)
    basic.showString(wifilink)
    basic.pause(60 * 1000)
    kittenwifi.mqtt_sethost("mqtt.thingspeak.com", "node01")
    basic.pause(1000)
    flag = true
    basic.showIcon(IconNames.Yes)
})
let upstr = ""
let current_WindDirection_List = 0
let DirS = ""
let current_WindSpeed = 0
let wifipass = ""
let wifilink = ""
let flag = false
weatherbit.startWeatherMonitoring()
weatherbit.startWindMonitoring()
flag = false
let ctu = false
let reconn = 0
let waitime = 0
basic.showLeds(`
    . # # # .
    # . . . #
    . . # # .
    . . . . .
    . . # . .
    `)
basic.pause(2000)
let wifino = 1
while (!(ctu)) {
    if (input.buttonIsPressed(Button.A)) {
        wifino += 1
        if (wifino >= 8) {
            wifino = 1
        }
    }
    basic.showNumber(wifino)
    if (input.buttonIsPressed(Button.B)) {
        ctu = true
        basic.showLeds(`
            . # . . .
            # # . . .
            . # . # .
            . . . # #
            . . . # .
            `)
    }
}
kittenwifi.wifi_init(SerialPin.P15, SerialPin.P14)
basic.pause(1000)
if (wifino == 1) {
    wifilink = "CHOIKOU 1"
    wifipass = ""
} else if (wifino == 2) {
    wifilink = "CHOIKOU 2"
    wifipass = ""
} else if (wifino == 3) {
    wifilink = "CHOIKOU 3"
    wifipass = ""
} else if (wifino == 4) {
    wifilink = "CHOIKOU 4"
    wifipass = ""
} else if (wifino == 5) {
    wifilink = "CHOIKOU 5"
    wifipass = ""
} else if (wifino == 6) {
    wifilink = "CHOIKOU 6"
    wifipass = ""
} else if (wifino == 7) {
    wifilink = "CHOIKOU GUEST"
    wifipass = "choi20kou"
}
kittenwifi.wifi_join(wifilink, wifipass)
basic.pause(10 * 1000)
basic.forever(function () {
    basic.pause(30 * 1000)
    ctu = false
    waitime = 0
    while (!(ctu)) {
        basic.pause(1 * 1000)
        basic.showNumber(waitime)
        waitime += 1
        if (waitime >= 60) {
            ctu = true
        }
        if (input.buttonIsPressed(Button.AB)) {
            ctu = true
        }
    }
    if (flag) {
        current_WindSpeed = weatherbit.windSpeed()
        DirS = weatherbit.windDirection()
        if (DirS == "E") {
            current_WindDirection_List = 90
        } else if (DirS == "S") {
            current_WindDirection_List = 180
        } else if (DirS == "W") {
            current_WindDirection_List = 270
        } else if (DirS == "N") {
            current_WindDirection_List = 0
        } else if (DirS == "NE") {
            current_WindDirection_List = 45
        } else if (DirS == "SE") {
            current_WindDirection_List = 135
        } else if (DirS == "SW") {
            current_WindDirection_List = 225
        } else if (DirS == "NW") {
            current_WindDirection_List = 315
        }
        upstr = "field1=" + current_WindDirection_List + "&" + "field2=" + Math.trunc(current_WindSpeed) + "&" + "field3=" + Math.idiv(weatherbit.temperature(), 100) + "&" + "field4=" + Math.idiv(weatherbit.pressure(), 25600) + "&" + "field5=" + Math.idiv(weatherbit.humidity(), 1024)
        kittenwifi.mqtt_publish(
        "channels/1098651/publish/P0VKX31W1E33Q2SG",
        upstr
        )
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . # # # .
            # # # # #
            `)
        basic.pause(500)
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            . # # # .
            `)
        basic.showString(upstr)
        basic.showIcon(IconNames.Happy)
    }
    basic.pause(5000)
    reconn += 1
    if (reconn >= 2) {
        kittenwifi.mqtt_sethost("mqtt.thingspeak.com", "node01")
        basic.showIcon(IconNames.EigthNote)
        basic.pause(1000)
        reconn = 0
    }
})
