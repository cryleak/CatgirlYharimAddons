import Dungeons from "../../../Atomx/skyblock/Dungeons"
import Settings from "../../config"

let playerNames
let coreOpen = 0
let time = 0
done = []
timePlayers = []
register("Chat", () => {
    if (!Settings().coreTimer) return
    playerNames = Object.getOwnPropertyNames(Dungeons.getTeamMembers())
    coreOpen = Date.now()
    getCoords.register()
    done = []
}).setCriteria("The Core entrance is opening!")

const getCoords = register("renderWorld", () => {
    World.getAllPlayers().forEach(entity => {
        if (playerNames.includes(entity.getName()))
        if (!done.includes(entity.getName())) {
            time = Math.round(Date.now() - coreOpen)
            if (entity.getZ() > 54.5) {
                playerName = entity.getName()
                timePlayers.push(playerName, time)
                done.push(entity.getName())
                if (done.length = 1) {
                    ChatLib.say("All Players in core at " + time / 1000)
                    getCoords.unregister()
                }
            }
        }
    })
}).unregister()

register("Chat", () => {
    getCoords.unregister()
}).setCriteria("[BOSS] Necron: You went further than any human before, congratulations.")

register("worldLoad", () => {
    getCoords.unregister()
})