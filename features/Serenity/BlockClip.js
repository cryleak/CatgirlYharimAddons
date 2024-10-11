import { chat, releaseMovementKeys, repressMovementKeys } from "../../utils/utils"
import Settings from "../../config"

let lastUse = Date.now()

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().blockClipKeybind)) return
    if (Date.now() - lastUse < 300) return
    if (!Player.getPlayer().field_70124_G) return
    lastUse = Date.now()

    releaseMovementKeys()
    clipForward(0.0625)
    Client.scheduleTask(0, () => {
        clipForward(1.4756)
        repressMovementKeys()
        chat("Clipped.")
    })
})

const clipForward = (distance) => { // I have no idea how optimal this is because I literally haven't learned about this shit in school yet and have very little understanding of it but it works
    const radians = Player.getYaw() * Math.PI / 180
    let [newX, newZ] = [Player.getX(), Player.getZ()]

    if (Math.abs(-Math.sin(radians)) > Math.abs(Math.cos(radians))) newX += distance * Math.sign(-Math.sin(radians))
    else newZ += distance * Math.sign(Math.cos(radians))
    Player.asPlayerMP().setPosition(newX, Player.getY(), newZ)
}