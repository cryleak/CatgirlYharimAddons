import Dungeons from "../../../Atomx/skyblock/Dungeons"
import { Keybind } from "../../../KeybindFix"
import Settings from "../../config"
import { rightClick, swapToItem, chat } from "../../utils/utils"

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

let selectedClass
let awaitingLeap = false
let phase
let index


register("packetReceived", () => {
    if (!awaitingLeap) return
    awaitingLeap = false
    Client.getMinecraft().func_147108_a(null)
    const teamMembers = Dungeons.getTeamMembers()
    Client.scheduleTask(() => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        toClick = Object.getOwnPropertyNames(teamMembers).find(playerName => teamMembers[playerName].class === selectedClass)
        if (!toClick) { chat("Class not found!") }
        const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === toClick.toLowerCase()) // Gets the slot to click
        if (!item) {
            chat("Could not find " + selectedClass)
            Client.currentGui.close()
            return
        }
        Player.getContainer().click(item)
    })
}).setFilteredClass(S2DPacketOpenWindow)

new Keybind("Tank AutoLeap", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    selectedClass = "Tank"
    swapToItem("Leap")
    Client.scheduleTask(() => { rightClick() })
});

new Keybind("Mage AutoLeap", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    selectedClass = "Mage"
    swapToItem("Leap")
    Client.scheduleTask(() => { rightClick() })
});

new Keybind("Berserk AutoLeap", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    selectedClass = "Berserk"
    swapToItem("Leap")
    Client.scheduleTask(() => { rightClick() })
});

new Keybind("Archer AutoLeap", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    selectedClass = "Archer"
    swapToItem("Leap")
    Client.scheduleTask(() => { rightClick() })
});

new Keybind("Healer AutoLeap", Keyboard.KEY_NONE, "CatgirlYharim").registerKeyPress(() => {
    selectedClass = "Healer"
    swapToItem("Leap")
    Client.scheduleTask(() => { rightClick() })
});

register("Chat", () => {
    phase = 0
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

register("Chat", () => {
    if (phase > 2 || phase < 0 || isNaN(phase)) return
    if (phase == 0) {
        if (!Settings().ee2) return
        index = Settings().ee2Class
    } else if (phase == 1) {
        if (!Settings().ee3) return
        index = Settings().ee3Class
    } else if (phase == 2) {
        if (!Settings().core) return
        index = Settings().coreClass
    }
    if (Client.isInGui()) {
        const teamMembers = Dungeons.getTeamMembers()
        selectedClass = classes[index]
        toClick = Object.getOwnPropertyNames(teamMembers).find(playerName => teamMembers[playerName].class === classes[index])
        if (!toClick) return
        const item = Player.getContainer()?.getItems().findIndex(x => x?.getName()?.substring(2)?.toLowerCase() === toClick.toLowerCase())
        Player.getContainer().click(0)
    } else {
        awaitingLeap = true
        selectedClass = classes[index]
        swapToItem("Leap")
        setTimeout(rightClick(), 50)
    }
    phase += 1
}).setCriteria(/^(\w{3,16}) \w{9,9} a \w{6,11}! \(?(?:7\/7|8\/8)\)$/)
