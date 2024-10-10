import Settings from "../../config"
import { playSound, soundNames } from "../../utils/utils"
let slotIndex = Player.getHeldItemIndex()

register("blockBreak", () => { // If the item you are holding is not the same as the item you were holding last time you sent a packet to the server then you stonk swapped.
    if (!Settings().stonkSwapDing) return
    if (slotIndex !== Player.getHeldItemIndex()) playSound(soundNames[Settings().stonkSwapSound], 10, Settings().stonkSwapPitch)
})

register("packetSent", (packet) => {
    slotIndex = packet.func_149614_c()
}).setFilteredClass(net.minecraft.network.play.client.C09PacketHeldItemChange)