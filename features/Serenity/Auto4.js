import Settings from "../../config"
import { chat } from "../../utils/utils"
import RenderLibV2 from "../../../RenderLibV2"
import { getDistanceToCoord } from "../../../BloomCore/utils/Utils"

const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
rightClickMethod.setAccessible(true)
const blocks = [
    { x: 64, y: 126, z: 50 },
    { x: 66, y: 126, z: 50 },
    { x: 68, y: 126, z: 50 },
    { x: 64, y: 128, z: 50 },
    { x: 66, y: 128, z: 50 },
    { x: 68, y: 128, z: 50 },
    { x: 64, y: 130, z: 50 },
    { x: 66, y: 130, z: 50 },
    { x: 68, y: 130, z: 50 }
]
/*
const rows = [
    [{ x: 64, y: 126, z: 50 }, { x: 66, y: 126, z: 50 }, { x: 68, y: 126, z: 50 }],
    [{ x: 64, y: 128, z: 50 }, { x: 66, y: 128, z: 50 }, { x: 68, y: 128, z: 50 }],
    [{ x: 64, y: 130, z: 50 }, { x: 66, y: 130, z: 50 }, { x: 68, y: 130, z: 50 }]
]
*/
let unshotBlocks = []
const predictedBlocks = new Set()
let shots = 0
let timeStarted
let active = false
let lastShot = Date.now()

register("step", () => { // Main thread
    if (!Settings().auto4) return
    if (!active) return
    if (Player?.getHeldItem()?.getID() !== 261) return
    if (getDistanceToCoord(63.5, 127, 35.5) > 0.75) return
    const bowCooldown = getBowCooldown()
    if (Date.now() - lastShot < bowCooldown) return

    let blockToShoot
    const prediction = getAdjacentPrediction()
    const emeraldBlock = unshotBlocks.find(({ x, y, z }) => World.getBlockAt(x, y, z).type.getID() === 133)
    // Shoot the emerald block if it hasn't been shot recently
    if (emeraldBlock && !predictedBlocks.has(emeraldBlock) || emeraldBlock && !prediction && unshotBlocks.length <= 2) {
        blockToShoot = emeraldBlock
        if (Player.getHeldItem()?.getName()?.includes("Terminator")) {
            const offsetDirection = blockToShoot.x === 64 ? 1 : -1
            const index = blocks.indexOf(emeraldBlock) + (offsetDirection === -1 ? -1 : 0)
            const shotBlocks = [blocks[index], blocks[index + 1]]
            predictedBlocks.add(shotBlocks[0])
            predictedBlocks.add(shotBlocks[1])
            Client.scheduleTask(17, () => { predictedBlocks.delete(shotBlocks[0]); predictedBlocks.delete(shotBlocks[1]); })
        } else {
            const shotBlocks = blocks[blocks.indexOf(emeraldBlock)]
            predictedBlocks.add(shotBlocks)
            Client.scheduleTask(17, () => predictedBlocks.delete(shotBlocks))
        }

    } else { // Predict
        blockToShoot = prediction
        if (!blockToShoot) return
        const index = unshotBlocks.indexOf(blocks[blockToShoot.index]) + (blockToShoot.offsetDirection === -1 ? -1 : 0)
        if (blockToShoot.adjacent) {
            const shotBlocks = [unshotBlocks[index], unshotBlocks[index + 1]]
            predictedBlocks.add(shotBlocks[0]) // I don't think rhino lets you put an iterable object in a set
            predictedBlocks.add(shotBlocks[1])
            Client.scheduleTask((Settings().auto4PredictionTimeout * 5 * (getBowCooldown() / 250)) - 4, () => { predictedBlocks.delete(shotBlocks[0]); predictedBlocks.delete(shotBlocks[1]); })
        }
        else {
            const shotBlocks = unshotBlocks[index]
            predictedBlocks.add(shotBlocks)
            Client.scheduleTask((Settings().auto4PredictionTimeout * 5 * (getBowCooldown() / 250)) - 4, () => predictedBlocks.delete(shotBlocks))
        }
    }
    let offset = 0.5
    if (Player.getHeldItem()?.getName()?.includes("Terminator")) offset = blockToShoot.x === 64 ? 1.3 : -0.6
    const [yaw, pitch] = calcYawPitch(blockToShoot.x + offset, blockToShoot.y + 1.1, blockToShoot.z)
    lastShot = Date.now()
    rotate(yaw, pitch)
    shots++
    Client.scheduleTask(0, () => rightClick())
}).setFps(100)

// auto rod swap if desired
register("chat", () => {
    if (!Settings().auto4 || !Settings().autoRod || !active) return
    if (getDistanceToCoord(63.5, 127, 35.5) > 0.75) return
    const rodSlot = Player.getInventory().getItems().findIndex(a => a?.getID() === 346)
    if (rodSlot > 7 || rodSlot < 0) {
        chat("Rod not found in your hotbar!")
        return
    }


    setTimeout(() => {
        if (getDistanceToCoord(63.5, 127, 35.5) > 0.75) return
        if (!active) return
        active = false
        const heldItemIndex = Player.getHeldItemIndex()
        chat("Rod Swapping.")
        Client.scheduleTask(1, () => Player.setHeldItemIndex(rodSlot))
        Client.scheduleTask(2, () => rightClick())
        Client.scheduleTask(3, () => {
            Player.setHeldItemIndex(heldItemIndex)
            active = true
        })
    }, 2500)
}).setCriteria(/^(?:Your (?:⚚ )?Bonzo's Mask saved your life!|Second Wind Activated! Your Spirit Mask saved your life!)$/)

// start prefiring
register("chat", () => {
    if (!Settings().auto4) return
    unshotBlocks = [...blocks] // Duplicate array

    active = true
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

// terms start
register("chat", () => {
    if (!Settings().auto4Stats) return
    timeStarted = Date.now()
    shots = 0
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

// dev complete
register("chat", (name) => {
    if (!Settings().auto4) return
    if (name !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) > 0.75) return
    active = false
    if (Settings().auto4Stats) chat(`i4 took ${((Date.now() - timeStarted) / 1000).toFixed(2)} seconds and ${shots} shots to finish.`)
}).setCriteria(/^(\w{3,16}) completed a device! \(\d\/\d\)$/)

// test command
register("command", () => {
    if (!Settings().auto4) return
    unshotBlocks = [...blocks]

    active = !active
    chat(`auto4 ${active ? "enabled" : "disabled"} (this is a debug command)`)
}).setName("auto4test")

// render stuff
register("renderWorld", () => {
    if (!Settings().auto4 || !Settings().auto4Solver) return
    if (!active) return
    blocks.forEach(block => {
        let color
        if (World.getBlockAt(block.x, block.y, block.z).type.getID() === 133) color = [0, 255, 0, Settings().predictionColor[3] / 255]
        else if (!unshotBlocks.includes(block)) color = [Settings().alreadyShotColor[0], Settings().alreadyShotColor[1], Settings().alreadyShotColor[2], Settings().alreadyShotColor[3] / 255]
        else if (predictedBlocks.has(block)) color = [Settings().predictionColor[0], Settings().predictionColor[1], Settings().predictionColor[2], Settings().predictionColor[3] / 255]
        else return
        RenderLibV2.drawInnerEspBox(block.x + 0.5, block.y, block.z + 0.5, 1, 1, ...color, true)
        RenderLibV2.drawEspBox(block.x + 0.5, block.y, block.z + 0.5, 1, 1, color[0], color[1], color[2], 1, true)
    })
})

register("worldUnload", () => {
    predictedBlocks.clear()
    unshotBlocks = [...blocks]
})

// Detect when the emerald block gets shot
register("packetReceived", (packet) => {
    if (!Settings().auto4) return
    if (!active) return

    const positionVec3 = packet.func_179827_b()
    const positionXYZ = { x: positionVec3.func_177958_n(), y: positionVec3.func_177956_o(), z: positionVec3.func_177952_p() }
    const index = unshotBlocks.findIndex(({ x, y, z }) => positionXYZ.x === x && positionXYZ.y === y && positionXYZ.z === z)
    if (index === -1) return

    const block = packet.func_180728_a().func_177230_c()
    const blockID = net.minecraft.block.Block.func_149682_b(block)
    if (blockID !== 159) return
    unshotBlocks.splice(index, 1)
}).setFilteredClass(net.minecraft.network.play.server.S23PacketBlockChange)

// Detect when it gets shot x2
register("packetReceived", (packet) => {
    if (!Settings().auto4) return
    if (!active) return

    const updatedBlocks = packet.func_179844_a()
    for (let i = 0; i < updatedBlocks.length; i++) {
        let updatedBlock = updatedBlocks[i]
        const block = updatedBlock.func_180088_c().func_177230_c()
        const blockID = net.minecraft.block.Block.func_149682_b(block)
        if (blockID !== 159) continue

        const positionVec3 = updatedBlock.func_180090_a()
        const positionXYZ = { x: positionVec3.func_177958_n(), y: positionVec3.func_177956_o(), z: positionVec3.func_177952_p() }
        const index = unshotBlocks.findIndex(({ x, y, z }) => positionXYZ.x === x && positionXYZ.y === y && positionXYZ.z === z)
        if (index === -1) continue

        unshotBlocks.splice(index, 1)
    }
}).setFilteredClass(net.minecraft.network.play.server.S22PacketMultiBlockChange)

// god help me
// I'm not even going to try to explain what is going on but I somehow thought this up.
const getAdjacentPrediction = () => {
    if (Player.getHeldItem()?.getName()?.includes("Terminator")) {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].x === 66) continue // Skip middle blocks because we will always be shooting adjacent to them anyways
            if (!unshotBlocks.includes(blocks[i])) continue
            if (predictedBlocks.has(blocks[i])) continue
            let offsetDirection = blocks[i].x === 64 ? 1 : -1 // 1 means it offsets to the left and -1 means it offsets to the right basically (this is awful)
            if (World.getBlockAt(blocks[i].x, blocks[i].y, blocks[i].z).type.getID() === 133 || World.getBlockAt(blocks[i + offsetDirection].x, blocks[i].y, blocks[i].z).type.getID() === 133) continue // Don't shoot adjacent to an emerald block
            if (unshotBlocks.includes(blocks[i + offsetDirection]) && !predictedBlocks.has(blocks[i + offsetDirection])) { // Checks if the adjacent block is not shot
                return { x: blocks[i].x, y: blocks[i].y, z: blocks[i].z, index: i, offsetDirection: offsetDirection, adjacent: true }
            }
        }
    }
    // It should've returned by now if there was an adjacent block pair that was shootable
    for (let i = 0; i < blocks.length; i++) { // Another for loop. Yes this code is probably terrible. I don't have a working brain so I wont make it better.
        if (!unshotBlocks.includes(blocks[i])) continue
        if (predictedBlocks.has(blocks[i])) continue
        if (World.getBlockAt(blocks[i].x, blocks[i].y, blocks[i].z).type.getID() === 133) continue
        return { x: blocks[i].x, y: blocks[i].y, z: blocks[i].z, index: i, adjacent: false }
    }
    return
}

// Functions

const rotate = (yaw, pitch) => {
    Player.getPlayer().field_70177_z = yaw
    Player.getPlayer().field_70125_A = pitch
}

const rightClick = () => rightClickMethod.invoke(Client.getMinecraft(), null)

const getBowCooldown = () => {
    const bowItem = Player.getInventory().getItems().find(item => item?.getID() === 261)
    const line = bowItem.getLore().find(line => line.includes("Shot Cooldown"))
    if (!line) return 250
    return (line.removeFormatting().match(/Shot Cooldown: (\d\.?\d+)s/)[1]) * 1000
}

// Skidded shit below cause I can't do math and was lazy
const calcYawPitch = (x, y, z) => {
    let d = {
        x: x - Player.getX(),
        y: y - (Player.getY() + Player.getPlayer().func_70047_e()),
        z: z - Player.getZ()
    }
    let yaw = 0
    let pitch = 0
    if (d.x != 0) {
        if (d.x < 0) { yaw = 1.5 * Math.PI; } else { yaw = 0.5 * Math.PI; }
        yaw = yaw - Math.atan(d.z / d.x)
    } else if (d.z < 0) { yaw = Math.PI }
    d.xz = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.z, 2))
    pitch = -Math.atan(d.y / d.xz)
    yaw = -yaw * 180 / Math.PI
    pitch = pitch * 180 / Math.PI
    if (pitch < -90 || pitch > 90 || isNaN(yaw) || isNaN(pitch) || yaw == null || pitch == null || yaw == undefined || pitch == null) return;

    return [yaw, pitch]

}