import Settings from "../../config"
import { soundNames, playSound } from "../../utils/utils"

register("packetReceived", (packet) => {
    if (!Settings().partyFinderNotification || packet.func_179841_c() === 2) return;
    const message = ChatLib.removeFormatting(packet.func_148915_c().func_150260_c());
    if (message.match(/^Party Finder > \w{3,16} joined the dungeon group! \(\w+ Level \d{1,2}\)$/)) playSound(soundNames[Settings().partyFinderSound], 10, Settings().partyFinderPitch)
}).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)