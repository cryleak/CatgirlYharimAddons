import Settings from "../../config"
const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

let wardrobeCooldown = false
let awaitingWardrobe = false
let index = 36

function wardrobe() {
    wardrobeCooldown = true
    awaitingWardrobe = true
    ChatLib.command("wardrobe")
    Client.scheduleTask(19, () => { wardrobeCooldown = false })
}

register("packetReceived", () => {
    if (!awaitingWardrobe) return
    awaitingWardrobe = false
    Client.scheduleTask(() => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        Client.getMinecraft().func_147108_a(null)
    })
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        Player.getContainer().click(index)
    })
    Client.scheduleTask(3, () => {
        Client.currentGui.close()
    })
}).setFilteredClass(S2DPacketOpenWindow)

register("Tick", () => {
    if (Client.isInGui()) return
    if (wardrobeCooldown) return
    if (Keyboard.isKeyDown(Settings().wdOneKeybind)) { wardrobe(); index = 36 }
    if (Keyboard.isKeyDown(Settings().wdTwoKeybind)) { wardrobe(); index = 37 }
    if (Keyboard.isKeyDown(Settings().wdThreeKeybind)) { wardrobe(); index = 38 }
    if (Keyboard.isKeyDown(Settings().wdFourKeybind)) { wardrobe(); index = 39 }
    if (Keyboard.isKeyDown(Settings().wdFiveKeybind)) { wardrobe(); index = 40 }
    if (Keyboard.isKeyDown(Settings().wdSixKeybind)) { wardrobe(); index = 41 }
    if (Keyboard.isKeyDown(Settings().wdSevenKeybind)) { wardrobe(); index = 42 }
    if (Keyboard.isKeyDown(Settings().wdEightKeybind)) { wardrobe(); index = 43 }
    if (Keyboard.isKeyDown(Settings().wdNineKeybind)) { wardrobe(); index = 44 }
})

register("command", (petIndex) => {
    ChatLib.command("wardrobe")
    index = petIndex
})