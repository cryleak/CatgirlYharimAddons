import { chat, releaseMovementKeys, repressMovementKeys } from "../../utils/utils"
import Settings from "../../config"
import { clipForward } from "../../utils/utils"

let lastUse = Date.now()

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().blockClipKeybind)) return
    if (Date.now() - lastUse < 300) return
    if (Client.isInGui()) return
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