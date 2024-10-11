// shoutout fortnite


import Settings from "../../config"
import { chat, leap } from "../../utils/utils"
import Dungeons from "../../../Atomx/skyblock/Dungeons"
import { getDistanceToCoord } from "../../../BloomCore/utils/Utils"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

register("command", (args) => {
    if (args === "toggle") {
        Settings().i4AutoLeap = !Settings().i4AutoLeap
        chat(`Auto Leap toggled ${Settings().i4AutoLeap ? "&2On" : "&0Off"}`)
    } else if (!args) chat(`Name is &6${Settings().leapPlayer}`)
    else {
        chat(`Name Set to &6${args}`)
        Settings().getConfig().setConfigValue("Leap", "leapPlayer", args)
    }
}).setName("autoleap").setAliases("al")

register("chat", (name) => {
    if (!Settings().i4AutoLeap || name !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) leap(Settings().autoLeapMode ? classes[Settings().leapClass] : Settings().leapPlayer)
}).setCriteria(/^(\w{3,16}) completed a device! \(\d\/\d\)$/)

register("command", () => {
    leap(Settings().autoLeapMode ? classes[Settings().leapClass] : Settings().leapPlayer)
}).setName("autoleapdebug")

const rightClick = () => {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true)
    rightClickMethod.invoke(Client.getMinecraft(), null)
}