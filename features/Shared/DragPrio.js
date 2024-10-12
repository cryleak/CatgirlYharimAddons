import Settings from "../../config"
import { getDistance3D } from "../../../BloomCore/utils/Utils"
import Dungeons from "../../../Atomx/skyblock/Dungeons"
import { chat } from "../../utils/utils"
import { noWalk, walk, stop, jump } from "../../utils/AutoP3Utils"
import { block } from "../../utils/utils"
import RenderLib from "../../../RenderLib"

const dragonNames = ["Purple", "Blue", "Red", "Green", "Orange"] // I am not using a map here since I am assigning dragons to numbers anyways.
const dragonColors = ["§5", "§b", "§4", "§2", "§6"]

const particleCoords = [
    { x: 56, y: 20, z: 125 }, // p
    { x: 83, y: 20, z: 94 }, // b
    { x: 27, y: 20, z: 59 }, // r
    { x: 27, y: 20, z: 94 }, // g
    { x: 83, y: 20, z: 56 } // o
]

const spawningDrags = []
let ticks = 0
let inP5 = false
let dragonIndex

register("packetReceived", () => {
    if (!ticks) { render.unregister(); return }
    ticks--
}).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)

register("chat", () => {
    inP5 = true
}).setCriteria("[BOSS] Wither King: We will decide it all, here, now.")

register("packetReceived", (packet) => {
    if (!Settings().dragPrio) return
    if (!inP5) return
    if (ticks !== 0) return
    if (packet.func_179749_a().toString() !== "ENCHANTMENT_TABLE") return
    const particleX = packet.func_149220_d()
    const particleY = packet.func_149226_e()
    const particleZ = packet.func_149225_f()

    // Index 0 is purple, 4 is orange, ordered based on PBRGO
    const dragon = particleCoords.findIndex(({ x, y, z }) => getDistance3D(x, y, z, particleX, particleY, particleZ) < 10) // Gets which dragon the particles are near
    if (dragon === -1 || spawningDrags.includes(dragon)) return
    spawningDrags.push(dragon)
    Client.scheduleTask(0, () => {
        if (!spawningDrags.length) return
        dragonIndex = getPrio()
        while (spawningDrags.length) spawningDrags.pop()
        if (!dragonIndex) return
        ticks = 100
        render.register()
    })
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles)

const getPrio = () => {
    if (spawningDrags.length === 1) return spawningDrags[0]

    let split = true
    if (getPower() < Settings().minSplitPower) split = false

    const priorityMap = split ? "01234" : "24103" // These numbers are confusing, but 24103 = robpg and 01234 = pbrgo
    const priority = spawningDrags.sort((a, b) => priorityMap.indexOf(b) - priorityMap.indexOf(a))

    const playerClass = Dungeons.getCurrentClass()
    let playerTeam // 1 = arch team 0 = bers team
    if (!split) playerTeam = 0
    else if (playerClass === "Archer" || playerClass === "Tank" || playerClass === "Healer" && Settings().healerGoWithArch && !spawningDrags.includes(0)) playerTeam = 1
    else if (playerClass === "Berserk" || playerClass === "Mage" || playerClass === "Healer") playerTeam = 0
    else { chat("There was an error getting class!"); playerTeam = 0 }

    return parseInt(priority[playerTeam])
}

const getPower = () => {
    const blessings = Dungeons.getBlessings()
    const powerLine = blessings.find(blessing => blessing.includes("Blessing of Power"))
    if (!powerLine) { chat("Failed to get power! Assuming power is 19!"); return 19 }
    let power = powerLine.match(/Blessing of Power (\d{1,2})/)
    power = parseInt(power[0])
    if (blessings.some(blessing => blessing.includes("Blessing of Time"))) power += 2.5
    return power
}

register("worldUnload", () => {
    inP5 = false
    ticks = 0
    render.unregister()
})

const render = register("renderOverlay", () => {
    const color = dragonColors[dragonIndex]
    const text = dragonNames[dragonIndex]

    Renderer.scale(2)
    Renderer.drawStringWithShadow(color + text, Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(color + text) / 4 - 6, Renderer.screen.getHeight() / 4 + 5)
    Renderer.scale(2)
    Renderer.drawStringWithShadow(color + (ticks / 20).toFixed(2) + "s", Renderer.screen.getWidth() / 4 - Renderer.getStringWidth(color + (ticks / 20).toFixed(2)) / 4 - 6, Renderer.screen.getHeight() / 4 + 17)
}).unregister()

//AutoP5

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");

const stackLocations = [
    { x: 24, z: 90, shouldJump: true },
    { x: 31, z: 109, shouldJump: true },
    { x: 33, z: 93, shouldJump: false },
    { x: 67, z: 70, shouldJump: false },
    { x: 49, z: 88, shouldJump: false }
]

const shootLocations = [
    { x: 56, y: 22, z: 125 },
    { x: 85, y: 23, z: 96.5 },
    { x: 27.5, y: 22, z: 59 },
    { x: 20, y: 24, z: 93 },
    { x: 85, y: 24, z: 55.5 }
]

const dragonList = ["Soul", "Ice", "Power", "Apex", "Flame"]

let atStackSpot = false
let dragonSpawned = false

const autop5 = register("renderWorld", () => {
    const playerClass = Dungeons.getCurrentClass()
    //if (playerClass !== "Archer" && playerClass !== "Berserk") return
    //if (!dragonIndex || !inP5) return
    if (!atStackSpot) {
        block(stackLocations[dragonIndex].x, Player.getY(), stackLocations[dragonIndex].z)
        if (stackLocations[dragonIndex].shouldJump) {
            jumpOn.register()
        }
        walk()
        if (getDistance3D(stackLocations[dragonIndex].x, Player.getY(), stackLocations[dragonIndex].z, Player.getX(), Player.getY(), Player.getZ()) < 1) {
            atStackSpot = true
            noWalk()
            stop()
            jumpOn.unregister()
        }
        return
    }
    if (atStackSpot) {
        if (!dragonSpawned) { dragonDead = false }
        if (ticks <= 18 && !dragonDead) {
            walk()
            KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i(), true)
        }
        if (!dragonSpawned) {
            block(shootLocations[dragonIndex].x, shootLocations[dragonIndex].y, shootLocations[dragonIndex].z)
        }
        World.getAllEntitiesOfType(net.minecraft.entity.boss.EntityDragon).forEach(ent => {
            if (ent.getName().includes(dragonList[dragonIndex])) {
                dragonSpawned = true
                let dragX = ent.getX()
                let dragY = ent.getY()
                let dragZ = ent.getZ()
                block(dragX, dragY, dragZ)
                if (ent.isDead()) {
                    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i(), false)
                    atStackSpot = false
                    dragonSpawned = false
                    dragonDead = true
                    autop5.unregister()
                    walkBack.register()
                }
            }
        })
    }
}).unregister()

const jumpOn = register("renderWorld", () => {
    let yawRad = (Player.getYaw()) * Math.PI / 180;
    let ID = World.getBlockAt(Player.getX() - Math.sin(yawRad) * 6, Player.getY(), Player.getZ() + Math.cos(yawRad) * 6).type.getID()
    if (ID !== 0 && ID !== 171) {
        jump()
    }
    RenderLib.drawEspBox(Player.getX() - Math.sin(yawRad) * 6, Player.getY(), Player.getZ() + Math.cos(yawRad) * 6, 1, 1, 1, 0, 0, 1, true)
}).unregister()

const walkBack = register("renderWorld", () => {
    block(54.5, 5, 87, 5)
    walk()
    if (getDistance3D(54.5, 5, 87, Player.getX(), Player.getY(), Player.getZ()) < 1) {
        noWalk()
        stop()
        walkBack.unregister()
    }
}).unregister()

/*register("Command", (index) => {
    if (index < 0 || index > 4) return
    ticks = 100
    atStackSpot = false
    dragonIndex = index
    autop5.register()
}).setName("p5")

register("Command", () => {
    KeyBinding.func_74510_a(Client.getMinecraft().field_71474_y.field_74313_G.func_151463_i(), false)
    atStackSpot = false
    dragonSpawned = false
    autop5.unregister()
    walkBack.register()
}).setName("stopp5")


register("Command", () => {
    ticks = 10
}).setName("test")*/