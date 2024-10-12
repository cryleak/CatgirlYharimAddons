import Settings from "../../config"
import { equipPet } from "../../utils/utils"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")

let petCooldown = false
awaitingPet = false;

register("packetReceived", () => {
    if (!awaitingPet) return
    awaitingPet = false
    Client.scheduleTask(() => {
        Client.getMinecraft().func_147108_a(null)
    })
    Client.scheduleTask(1, () => {
        Player.getContainer().click(itemIndex)
    })
}).setFilteredClass(S2DPacketOpenWindow)

function pet() {
    petCooldown = true
    Client.scheduleTask(19, () => { petCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (petCooldown) return
    if (Keyboard.isKeyDown(Settings().petOneKeybind)) { equipPet(Settings().petOne); pet() }
    if (Keyboard.isKeyDown(Settings().petTwoKeybind)) { equipPet(Settings().petTwo); pet() }
    if (Keyboard.isKeyDown(Settings().petThreeKeybind)) { equipPet(Settings().petThree); pet() }
    if (Keyboard.isKeyDown(Settings().petFourKeybind)) { equipPet(Settings().petFour); pet() }
    if (Keyboard.isKeyDown(Settings().petFiveKeybind)) { equipPet(Settings().petFive); pet() }
})