// Based off SA Termsim

import { chat } from "../utils/utils"
import PacketGui from "../utils/packetGui";

const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect");
const MCItemStack = Java.type("net.minecraft.item.ItemStack");

let cwid = 0;
let clicked = false
let firstClickTime = Date.now()
let firstClick = true

const allowedSlots = [11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33]
let neededClicks

export function open(ping, clicks = [], time) {
    ++cwid;
    if (cwid > 100) cwid = 1;
    const gui = new PacketGui(cwid, "Correct all the panes!", 45);

    if (time === undefined) {
        for (let slot of allowedSlots) { // Randomly solving some of the panes
            if (Math.random() > 0.75) clicks.push(slot)
            if (15 - clicks.length <= 14) break; // There will always be at least 7 unsolved panes. This is an arbitrary number idk why I picked 7
        }
        neededClicks = 15 - clicks.length
        time = Date.now();
    }

    const patternLeft = [...allowedSlots];

    clicks.forEach(slot => {
        const index = patternLeft.indexOf(slot)
        if (index !== -1) patternLeft.splice(index, 1);
    });

    const state = [];

    const applyState = () => {
        state.forEach((item, slot) => {
            gui.setSlot(slot, item);
        });
        clicked = false
    };

    for (let i = 0; i < 54; ++i) {
        state[i] = getPane(15);
    }
    allowedSlots.forEach(slot => {
        state[slot] = getPane(14);
    });

    clicks.forEach(slot => {
        state[slot] = getPane(5)
    });
    applyState();

    let calculatedDelay = Math.ceil(ping / 50) - 1
    if (calculatedDelay < 0) calculatedDelay = 0

    gui.onClick((slot) => { // This somehow works. I have no idea how.
        if (!clicked) {
            const index = allowedSlots.indexOf(slot)
            clicked = true
            if (index !== -1) {
                if (firstClick) firstClickTime = Date.now() - time
                firstClick = false
                Client.scheduleTask(calculatedDelay, () => {
                    const alreadyClicked = clicks.indexOf(slot)

                    if (alreadyClicked !== -1) clicks.splice(alreadyClicked, 1)
                    else clicks.push(slot);

                    playSound("random.click", 0.5, 1);
                    playSound("note.pling", 8, 4.047618865966797);
                    open(ping, clicks, time);
                    if (patternLeft.length - 1 === 0 && alreadyClicked === -1) {
                        gui.close();
                        const termTime = Date.now() - time
                        const CPS = (1000 / ((termTime - firstClickTime) / neededClicks)).toFixed(2)
                        chat("Terminal complete!");
                        chat("Time taken: §a" + termTime + "§rms. CPS: " + CPS + ". First click time: " + firstClickTime + "ms. Time if it was numbers: " + ((termTime / (neededClicks / 14) / 1000).toFixed(3)) + "s.");
                        firstClick = true
                        Client.scheduleTask(20, () => open(ping))
                    }
                });
            } else {
                setTimeout(() => {
                    gui.setCursor();
                    applyState();
                }, ping);
            }
        } else chat("You clicked too fast.")
    });
}

function getPane(meta, count = 1) {
    if (count === undefined) count = 1;
    return new Item(new MCItemStack(new Item(160).getItem(), count, meta)).setName("");
}

function playSound(soundName, volume, pitch) {
    try {
        fireChannelRead(new S29PacketSoundEffect(soundName, Player.getX(), Player.getY(), Player.getZ(), volume, pitch))
    } catch (e) {
        console.log(e)
    }
}

function fireChannelRead(packet) {
    Client.getConnection().func_147298_b().channel().pipeline().fireChannelRead(packet);
}

export default { open };

register("command", (args) => {
    if (!FileLib.exists("./config/ChatTriggers/modules/soshimeeaddons")) {
        chat("SA isn't installed!")
        return
    }
    let ping = parseInt(args)
    if (!ping) ping = 0
    open(ping)
}).setName("panes")