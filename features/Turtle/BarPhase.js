import { chat, releaseMovementKeys, repressMovementKeys, getIdOfBlock } from "../../utils/utils"
import Settings from "../../config"

let lastUse = Date.now()
let lastPress = Date.now()

register("tick", () => {
    if (!Keyboard.isKeyDown(Settings().barPhaseKeybind)) return
    if (Date.now() - lastPress < 200) return
    lastPress = Date.now()
    if (Client.isInGui()) return
    if (Settings().barPhaseToggle) {
        chat("Barphase off")
        Settings().getConfig().setConfigValue("Clip", "barPhaseToggle", false)
    } else {
        chat("Barphase on")
        Settings().getConfig().setConfigValue("Clip", "barPhaseToggle", true)
    }
})
register("tick", () => {
    if (!Settings().barPhaseToggle) return
    if (Date.now() - lastUse < 50) return
    lastUse = Date.now()
    if (!Player.getPlayer().field_70124_G || !Player.getPlayer().field_70123_F) return
    let ID = getIdOfBlock(Math.floor(Player.getX()), Math.floor(Player.getY()), Math.floor(Player.getZ()))
    let ID1 = getIdOfBlock(Math.floor(Player.getX()), Math.floor(Player.getY()) + 1, Math.floor(Player.getZ()))
    if (ID === 0 && ID1 === 0) return // Don't bar phase through fucking air
    if (ID !== 0 && ID !== 101) return
    if (ID1 !== 0 && ID1 !== 101) return
    let distanceX = 0
    let distanceZ = 0
    if (Player.getZ() - Math.floor(Player.getZ()) == 0.13749998807907104) { distanceZ = + 0.06 }
    if (Player.getX() - Math.floor(Player.getX()) == 0.13749998807907104) { distanceX = + 0.06 }
    if (Player.getZ() - Math.floor(Player.getZ()) == 0.862500011920929) { distanceZ = - 0.06 }
    if (Player.getX() - Math.floor(Player.getX()) == 0.862500011920929) { distanceX = - 0.06 }

    releaseMovementKeys()
    Player.getPlayer().func_70107_b(Player.getX() + distanceX, Player.getY(), Player.getZ() + distanceZ)
    Client.scheduleTask(0, () => {
        Player.getPlayer().func_70107_b(Player.getX() + distanceX * 5, Player.getY(), Player.getZ() + distanceZ * 5)
        repressMovementKeys()
    })
})

register("command", () => {
    if (toggled) {
        chat("Barphase off")
        Settings().getConfig().setConfigValue("Clip", "barPhaseToggle", false)
    } else {
        chat("Barphase on")
        Settings().getConfig().setConfigValue("Clip", "barPhaseToggle", true)
    }
}).setName("barphase")