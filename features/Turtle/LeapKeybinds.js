import Settings from "../../config"
import { rightClick, swapToItem, leap } from "../../utils/utils"

const classes = ["Archer", "Berserk", "Mage", "Healer", "Tank"]

let leapCooldown = false
let selectedClass
let phase
let index

function leaping() {
    leapCooldown = true
    Client.scheduleTask(19, () => { leapCooldown = false })
}

register("Tick", () => {
    if (Client.isInGui()) return
    if (leapCooldown) return
    if (Keyboard.isKeyDown(Settings().tankKeybind)) { leaping(); leap("Tank") }
    if (Keyboard.isKeyDown(Settings().mageKeybind)) { leaping(); leap("Mage") }
    if (Keyboard.isKeyDown(Settings().berserkKeybind)) { leaping(); leap("Berserk") }
    if (Keyboard.isKeyDown(Settings().archerKeybind)) { leaping(); leap("Archer") }
    if (Keyboard.isKeyDown(Settings().healerKeybind)) { leaping(); leap("Healer") }
})

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
        leap(classes[index])
    }
    phase += 1
}).setCriteria(/^(\w{3,16}) \w{9,9} a \w{6,11}! \(?(?:7\/7|8\/8)\)$/)

register("command", (target) => {
    leap(target)
}).setName("leap")
