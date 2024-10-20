import Settings from "../../config"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
let petCooldown = false
let awaitingPet = false
let toClick = 10

function pet() {
    petCooldown = true
    awaitingPet = true
    ChatLib.command("pets")
    Client.scheduleTask(19, () => { petCooldown = false })
}

register("packetReceived", () => {
    if (!awaitingPet) return
    awaitingPet = false
    Client.scheduleTask(2, () => {
        Client.getMinecraft().func_147108_a(null)
        Player.getContainer().click(toClick)
    })
}).setFilteredClass(S2DPacketOpenWindow)

register("Tick", () => {
    if (Client.isInGui()) return
    if (petCooldown) return
    if (Keyboard.isKeyDown(Settings().petOneKeybind)) { toClick = (Settings().petOne); pet() }
    if (Keyboard.isKeyDown(Settings().petTwoKeybind)) { toClick = (Settings().petTwo); pet() }
    if (Keyboard.isKeyDown(Settings().petThreeKeybind)) { toClick = (Settings().petThree); pet() }
    if (Keyboard.isKeyDown(Settings().petFourKeybind)) { toClick = (Settings().petFour); pet() }
    if (Keyboard.isKeyDown(Settings().petFiveKeybind)) { toClick = (Settings().petFive); pet() }
})