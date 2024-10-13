import { chat, releaseMovementKeys, repressMovementKeys, clipForward } from "../../utils/utils"
import Settings from "../../config"

let lastUse = Date.now()

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().barPhaseKeybind)) return
    if (Date.now() - lastUse < 300) return
    if (Client.isInGui()) return
    if (!Player.getPlayer().field_70124_G || !Player.getPlayer().field_70123_F) return
    if (World.getBlockAt(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ())).type.getID() !== 101) return

    lastUse = Date.now()
    releaseMovementKeys()
    clipForward(0.062)
    Client.scheduleTask(0, () => {
        clipForward(0.5)
        repressMovementKeys()
    })
    chat("Phasing")
})