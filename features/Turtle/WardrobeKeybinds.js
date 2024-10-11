import Settings from "../../config"
import { equipWardrobe } from "../../utils/utils"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

let wardrobeCooldown = false

register("packetReceived", () => {
    if (!awaitingWardrobe) return
    awaitingWardrobe = false
    Client.scheduleTask(() => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        Client.getMinecraft().func_147108_a(null)
    })
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Wardrobe (1/2)") return
        const item = itemIndex
        Player.getContainer().click(item)
    })
    Client.scheduleTask(2, () => {
        Client.currentGui.close()
    })
}).setFilteredClass(S2DPacketOpenWindow)

function wardrobe() {
    wardrobeCooldown = true
    Client.scheduleTask(19, () => { wardrobeCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (wardrobeCooldown) return
    if (Keyboard.isKeyDown(Settings().wdOneKeybind)) { wardrobe(); equipWardrobe(36) }
    if (Keyboard.isKeyDown(Settings().wdTwoKeybind)) { wardrobe(); equipWardrobe(37) }
    if (Keyboard.isKeyDown(Settings().wdThreeKeybind)) { wardrobe(); equipWardrobe(38) }
    if (Keyboard.isKeyDown(Settings().wdFourKeybind)) { wardrobe(); equipWardrobe(39) }
    if (Keyboard.isKeyDown(Settings().wdFiveKeybind)) { wardrobe(); equipWardrobe(40) }
    if (Keyboard.isKeyDown(Settings().wdSixKeybind)) { wardrobe(); equipWardrobe(41) }
    if (Keyboard.isKeyDown(Settings().wdSevenKeybind)) { wardrobe(); equipWardrobe(42) }
    if (Keyboard.isKeyDown(Settings().wdEightKeybind)) { wardrobe(); equipWardrobe(43) }
    if (Keyboard.isKeyDown(Settings().wdNineKeybind)) { wardrobe(); equipWardrobe(44) }
})