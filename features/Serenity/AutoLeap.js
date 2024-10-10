// shoutout fortnite


import Settings from "../../config"
import { chat } from "../../utils/utils"
import Dungeons from "../../../Atomx/skyblock/Dungeons"
import { getDistanceToCoord } from "../../../BloomCore/utils/Utils"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

awaitingLeap = false

register("packetReceived", () => {
    if (!Settings().i4AutoLeap || !awaitingLeap) return
    awaitingLeap = false
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return

        // Get name of person to leap to
        let playerToLeapTo
        if (Settings().autoLeapMode) { // If you are Leaping to a specific class
            const classToLeapTo = classes[Settings().leapClass]
            const teamMembers = Dungeons.getTeamMembers()

            playerToLeapTo = Object.getOwnPropertyNames(teamMembers).find(playerName => teamMembers[playerName].class === classToLeapTo)
            if (!playerToLeapTo) { chat("Couldn't find " + classToLeapTo); return }
        } else playerToLeapTo = Settings().leapPlayer


        const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === playerToLeapTo.toLowerCase()) // Gets the slot to click
        Player.getContainer().click(item)
        chat(`Attempting to Leap`)
    })
}).setFilteredClass(S2DPacketOpenWindow)

const clickLeap = () => {
    leapSlot = Player.getInventory().getItems().findIndex(a => a?.getName()?.removeFormatting() === "Infinileap")
    if (leapSlot > 7 || leapSlot < 0) { chat("Leap not found in your Hotbar!"); return } else {
        heldItem = Player.getHeldItemIndex()
        awaitingLeap = true
        Player.setHeldItemIndex(leapSlot)
        Client.scheduleTask(0, () => {
            rightClick()
        })
        Client.scheduleTask(2, () => {
            Player.setHeldItemIndex(heldItem)
        })
    }
}

register("command", (args) => {
    if (args == "toggle") {
        Settings().i4AutoLeap = !Settings().i4AutoLeap
        chat(`Auto Leap toggled ${Settings().i4AutoLeap ? "&2On" : "&0Off"}`)
    } else if (!args) {
        chat(`Name is &6${Settings().leapPlayer}`)
    } else {
        chat(`Name Set to &6${args}`)
        Settings().leapPlayer = args
    }
}).setName("autoleap").setAliases("al")

register("chat", (name) => {
    if (!Settings().i4AutoLeap || name !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) clickLeap()
}).setCriteria(/^(\w{3,16}) completed a device! \(\d\/\d\)$/)

register("command", () => {
    clickLeap()
}).setName("autoleapdebug")

const rightClick = () => {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true)
    rightClickMethod.invoke(Client.getMinecraft(), null)
}